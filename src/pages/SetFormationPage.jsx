import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle, useCallback } from 'react';
import { useParams, useNavigate, } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faUser, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { fetchChampionshipDetails } from '../api/championships';
import { fetchMatchDetails } from '../api/matches';
import { fetchTeamPlayers, fetchPlayersForChampionship, fetchPlayersDetailsByIds } from '../api/players';
import { fetchFormation, saveFormation, fetchFormationWithStats } from '../api/formations';
import { getToken, decodeToken } from '../utils/auth';
import SoccerField from '../components/SoccerField';
import { ItemTypes } from '../utils/dndTypes';
import Notification from '../components/calendar/Notification';
import { getSettingsForSport } from '../utils/gameSettings';
import { useIsMobile } from '../utils/hooks';
import { getRoleIcon } from '../utils/icons';


const SetFormationPage = forwardRef(({ matchId: propMatchId, championshipId: propChampionshipId, onFormationSaved, isModal = false, isPastMatch = false }, ref) => {
    const params = useParams();
    // Usa l'ID dai props se fornito (per il modale), altrimenti dai parametri URL.
    const matchId = propMatchId || params.matchId;
    const [championshipId, setChampionshipId] = useState(propChampionshipId || null);

    const isMobile = useIsMobile(); // Usiamo l'hook

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ show: false, message: '' });
    const [matchDetails, setMatchDetails] = useState(null);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [playerDetails, setPlayerDetails] = useState({});
    const [playerStats, setPlayerStats] = useState({});

    // Impostazioni di gioco dinamiche
    const [gameSettings, setGameSettings] = useState(getSettingsForSport('CALCIO_7'));
    // STATO AGGIUNTO PER LO SPORT TYPE
    const [sportType, setSportType] = useState(null); 

    // Dati formazione
    const [starters, setStarters] = useState(Array(gameSettings.starters).fill(null));
    const [reserves, setReserves] = useState(Array(gameSettings.reserves).fill(null));
    const [module, setModule] = useState(gameSettings.defaultModule);
    const [selectedSlot, setSelectedSlot] = useState(null); // Nuovo stato per lo slot selezionato
    const [isFutsal,setIsFutsal] = useState(false)
    const showAppNotification = (message) => {
        setNotification({ show: true, message });
        setTimeout(() => {
            setNotification({ show: false, message: '' });
        }, 3000);
    };


    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const matchData = await fetchMatchDetails(matchId);
                setMatchDetails(matchData);

                const currentChampionshipId = propChampionshipId || matchData.championship_id;
                setChampionshipId(currentChampionshipId);

                // Carica i dettagli del campionato per ottenere il tipo di sport
                const championshipData = await fetchChampionshipDetails(currentChampionshipId);
                
                // ASSEGNAZIONE DELLO SPORT TYPE
                const sport = championshipData.sport_type;
                setSportType(sport);
                // VARIABILE PER CALCIO A 5 (serve a nascondere i ruoli)
                setIsFutsal(sport === 'CALCIO_5');

                const settings = getSettingsForSport(sport);
                setGameSettings(settings);
                setModule(settings.defaultModule); // Imposta il modulo di default


                const token = getToken();
                const userDetails = decodeToken(token);

                // Carica i giocatori ATTUALI della squadra
                const teamData = await fetchTeamPlayers(matchData.championship_id, userDetails.id);
                const players = teamData.players || [];
                const initialPlayerDetails = players.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
                setTeamPlayers(players);
                setPlayerDetails(initialPlayerDetails); // Imposta i giocatori attuali

                let formationToLoad;
                
                if (isPastMatch) {
                    const data = await fetchFormationWithStats(matchId);
                    formationToLoad = data.formation;

                    // Mappiamo le statistiche per un accesso rapido tramite ID giocatore
                    const statsMap = (data.stats || []).reduce((acc, stat) => {
                        acc[stat.real_player_id] = stat;
                        return acc;
                    }, {});
                    setPlayerStats(statsMap);
                    
                    // --- INIZIO MODIFICA PER GIOCATORI STORICI ---
                    const loadedStarters = formationToLoad.starters_player_ids || [];
                    const loadedReserves = formationToLoad.reserves_player_ids || [];
                    const allFormationPlayerIds = [...loadedStarters, ...loadedReserves].filter(Boolean);

                    // Filtra gli ID che NON sono presenti nei dettagli dei giocatori attuali
                    const missingPlayerIds = allFormationPlayerIds.filter(id => !initialPlayerDetails[id]);

                    let historicalPlayerDetails = {};
                    if (missingPlayerIds.length > 0) {
                        // ➡️ CHIAMA LA FUNZIONE PER RECUPERARE I DETTAGLI STORICI
                        const missingPlayersData = await fetchPlayersDetailsByIds(missingPlayerIds); 
                        historicalPlayerDetails = missingPlayersData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
                    }

                    // Unisci i dettagli dei giocatori attuali e storici
                    setPlayerDetails(prevDetails => ({
                        ...prevDetails, 
                        ...historicalPlayerDetails, 
                    }));
                    // --- FINE MODIFICA PER GIOCATORI STORICI ---

                } else {
                    formationToLoad = await fetchFormation(matchId);
                }

                if (formationToLoad) {
                    // Assicura che gli array abbiano la lunghezza corretta, riempiendo con null
                    const loadedStarters = formationToLoad.starters_player_ids || [];
                    const paddedStarters = [...loadedStarters, ...Array(settings.starters - loadedStarters.length).fill(null)];
                    setStarters(paddedStarters);

                    const loadedReserves = formationToLoad.reserves_player_ids || [];
                    const paddedReserves = [...loadedReserves, ...Array(settings.reserves - loadedReserves.length).fill(null)];
                    setReserves(paddedReserves);

                    setModule(formationToLoad.module || settings.defaultModule);
                } else {
                    // Se non c'è una formazione, inizializza gli stati con array vuoti (pieni di null)
                    setStarters(Array(settings.starters).fill(null));
                    setReserves(Array(settings.reserves).fill(null));
                }

            } catch (err) {
                console.error("Errore nel caricamento dei dati:", err);
                showAppNotification("Impossibile caricare i dati per la formazione. Riprova più tardi.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [matchId, propChampionshipId, isPastMatch]);
    
    
    const handleSaveFormation = async () => {
        const filledStarters = starters.filter(Boolean);
        if (filledStarters.length !== gameSettings.starters) {
            showAppNotification(`Devi schierare ${gameSettings.starters} titolari.`);
            return;
        }
        try {
            // Filtra gli ID nulli prima di inviare i dati al backend
            const finalStarters = starters.filter(id => id != null);
            const finalReserves = reserves.filter(id => id != null);

            await saveFormation(matchId,
                finalStarters,
                finalReserves,
                module
            );
            if (onFormationSaved) {
                onFormationSaved(); // Chiude il modale e aggiorna
            } else {
                navigate(`/championships/${championshipId}/dashboard`);
            }
        } catch (err) {
            console.error("Errore nel salvataggio della formazione:", err);
            showAppNotification(err.message || "Errore sconosciuto durante il salvataggio.");
        }
    };

    const getRolesForModule = (moduleValue) => {
        const positions = SoccerField.getPositions(moduleValue, true); // Chiediamo solo i ruoli
        return positions[moduleValue] || [];
    };

    const handleModuleChange = (newModule) => {
        if (isPastMatch) return; // Non permettere modifiche per partite passate
        // Svuota i titolari quando si cambia modulo per evitare conflitti di ruolo.
        setStarters([...Array(gameSettings.starters).fill(null)]);
        setModule(newModule);
        setSelectedSlot(null); // Deseleziona qualsiasi slot
    };

    const handleDropOnSlot = useCallback((draggedItem, targetSlotType, targetSlotIndex, requiredRole) => {
        if (isPastMatch) return; // Non permettere drop per partite passate

        const draggedPlayer = draggedItem.player;

        // Creiamo copie degli stati correnti per poterle modificare.
        let newStarters = [...starters];
        let newReserves = [...reserves];

        // 1. TROVIAMO LA SORGENTE DEL GIOCATORE TRASCINATO
        const sourceIndexStarters = newStarters.indexOf(draggedPlayer.id);
        const sourceIndexReserves = newReserves.indexOf(draggedPlayer.id);
        const sourceInfo = {
            type: sourceIndexStarters > -1 ? 'starter' : (sourceIndexReserves > -1 ? 'reserve' : 'list'),
            index: sourceIndexStarters > -1 ? sourceIndexStarters : sourceIndexReserves
        };

        // 2. TROVIAMO L'EVENTUALE GIOCATORE NELLO SLOT DI DESTINAZIONE
        const targetPlayerId = targetSlotType === 'starter' ? newStarters[targetSlotIndex] : newReserves[targetSlotIndex];

        // 3. VALIDAZIONI
        // MODIFICA QUI: Ignora la validazione dei ruoli se è Calcio a 5
        if (targetSlotType === 'starter' && !isFutsal) { 
            const targetPlayer = playerDetails[targetPlayerId];
            if (!targetPlayer && requiredRole && draggedPlayer.role !== requiredRole && draggedPlayer.second_role !== requiredRole) {
                showAppNotification(`Puoi inserire solo un ${requiredRole.toLowerCase()} in questa posizione.`);
                return;
            }
            if (targetPlayer && draggedPlayer.role !== targetPlayer.role && draggedPlayer.second_role !== targetPlayer.role && draggedPlayer.role !== targetPlayer.second_role && draggedPlayer.second_role !== targetPlayer.second_role) {
                showAppNotification(`Non puoi scambiare un ${draggedPlayer.role.toLowerCase()} con un ${targetPlayer.role.toLowerCase()} in questa posizione.`);
                return;
            }
        }
        // FINE MODIFICA

        // 4. ESECUZIONE DELLO SPOSTAMENTO/SCAMBIO
        // Posiziona il giocatore trascinato nella sua nuova posizione
        if (targetSlotType === 'starter') newStarters[targetSlotIndex] = draggedPlayer.id;
        else newReserves[targetSlotIndex] = draggedPlayer.id;

        // Libera la posizione di origine del giocatore trascinato
        if (sourceInfo.type === 'starter') newStarters[sourceInfo.index] = null;
        else if (sourceInfo.type === 'reserve') newReserves[sourceInfo.index] = null;

        // Se c'era un giocatore nello slot di destinazione (scambio), spostalo nello slot di origine
        if (targetPlayerId) {
            if (sourceInfo.type === 'starter') newStarters[sourceInfo.index] = targetPlayerId;
            else if (sourceInfo.type === 'reserve') newReserves[sourceInfo.index] = targetPlayerId;
        }

        // 5. Applica gli aggiornamenti di stato
        setStarters(newStarters);
        setReserves(newReserves);
    }, [starters, reserves, playerDetails, isFutsal]); // AGGIUNTO isFutsal alle dipendenze

    const handleRemovePlayer = useCallback((slotType, slotIndex) => {
        if (isPastMatch) return; // Non permettere rimozione per partite passate

        if (slotType === 'starter') {
            setStarters(prevStarters => {
                const newStarters = [...prevStarters];
                newStarters[slotIndex] = null;
                return newStarters;
            });
        } else if (slotType === 'reserve') {
            setReserves(prevReserves => {
                const newReserves = [...prevReserves];
                newReserves[slotIndex] = null;
                return newReserves;
            });
        }
    }, []);

    // Nuovo: Gestisce il click su uno slot
    const handleSlotClick = useCallback((slotType, slotIndex, player, requiredRole) => {
        if (isPastMatch) return; // Non permettere click per partite passate

        if (player) {
            // Se lo slot è pieno, rimuovi il giocatore
            handleRemovePlayer(slotType, slotIndex);
        } else {
            // Se lo slot è vuoto, selezionalo (o deselezionalo se già selezionato)
            const newSelected = { type: slotType, index: slotIndex, role: requiredRole };
            if (selectedSlot && selectedSlot.type === newSelected.type && selectedSlot.index === newSelected.index) {
                setSelectedSlot(null); // Deseleziona
            } else {
                setSelectedSlot(newSelected); // Seleziona
            }
        }
    }, [selectedSlot, handleRemovePlayer]);

    // Nuovo: Gestisce il click su un giocatore dalla lista
    const handlePlayerListClick = useCallback((player) => {
        if (isPastMatch) return; // Non permettere click per partite passate
        if (!selectedSlot) return; // Fa nulla se nessuno slot è selezionato
        handleDropOnSlot({ player }, selectedSlot.type, selectedSlot.index, selectedSlot.role);
        setSelectedSlot(null); // Deseleziona lo slot dopo aver piazzato il giocatore
    }, [selectedSlot, handleDropOnSlot]);

    useImperativeHandle(ref, () => ({
        getFormation: () => ({ starters, reserves, module }),
        submit: handleSaveFormation,
    }));

    const playersByRole = useMemo(() => {
        const allSelectedIds = [...starters, ...reserves].filter(Boolean);
        const available = teamPlayers.filter(p => !allSelectedIds.includes(p.id));

        const grouped = available.reduce((acc, player) => {
            (acc[player.role] = acc[player.role] || []).push(player);
            return acc;
        }, {});

        // Raggruppa per ruolo se NON è Calcio a 5, altrimenti mostra tutti i ruoli in ordine alfabetico
        const roleOrder = isFutsal ? Object.keys(grouped).sort() : ['PORTIERE', 'DIFENSORE', 'CENTROCAMPISTA', 'ATTACCANTE'];

        return roleOrder.filter(key => grouped[key]).reduce((acc, key) => { acc[key] = grouped[key]; return acc; }, {});
    }, [teamPlayers, starters, reserves, isFutsal]); // AGGIUNTO isFutsal

    const isSaveDisabled = starters.filter(Boolean).length !== gameSettings.starters;

    if (loading) {
        return (
            <div className="central-box">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Caricamento dati formazione...</p>
                </div>
            </div>
        );
    }

    if (notification.show && !matchDetails) {
        return <div className="central-box"><p className="error-message">{notification.message}</p></div>;
    }

    const content = (
        <DndProvider backend={HTML5Backend} context={window}>
            <Notification show={notification.show} message={notification.message} />
            <div className="formation-main-content">
                {/* Colonna Sinistra: Lista Giocatori */}
                <div className="player-list-panel">
                    {playersByRole && Object.keys(playersByRole).length === 0 && (
                        <p className="no-players-message hide-on-mobile">Nessun giocatore</p>
                    )}
                    {Object.keys(playersByRole).map((role, index) => (
                        <React.Fragment key={role}>
                            <div className="role-group-list">
                                {/* Visualizza il ruolo solo se NON è Calcio a 5 */}
                                {!isFutsal && <h5 className="hide-on-mobile">{role}</h5>}
                                <div className="role-group-players">
                                    {playersByRole[role].map(player => (
                                        <DraggablePlayerListItem key={player.id} player={player} getRoleIcon={getRoleIcon} getSecondRoleIcon={getRoleIcon} onPlayerClick={handlePlayerListClick} isFutsal={isFutsal} />
                                    ))}
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {/* Colonna Centrale: Campo */}
                <div className="field-panel">
                    <SoccerField 
                        module={module} 
                        starters={starters} 
                        onDrop={handleDropOnSlot} 
                        onSlotClick={handleSlotClick} 
                        playerDetails={playerDetails} 
                        getRoleIcon={getRoleIcon} 
                        selectedSlot={selectedSlot} 
                        isPastMatch={isPastMatch} 
                        playerStats={playerStats} 
                        isFutsal={isFutsal}
                    />
                    {/* Su mobile, la panchina è renderizzata accanto al campo */}
                    {isMobile && <BenchPanel reserves={reserves} playerDetails={playerDetails} onDrop={handleDropOnSlot} onSlotClick={handleSlotClick} getRoleIcon={getRoleIcon} selectedSlot={selectedSlot} isPastMatch={isPastMatch} playerStats={playerStats} />}
                </div>

                {/* Colonna Destra: Modulo e Panchina */}
                <div className="right-panel">
                    <div className="module-selector-box">
                        <label htmlFor="module-select" className="hide-on-mobile">Modulo</label>
                        <select id="module-select" value={module} onChange={(e) => handleModuleChange(e.target.value)} disabled={isPastMatch}>
                            {gameSettings.modules.map(mod => (
                                <option key={mod} value={mod}>{mod}</option>
                            ))}
                        </select>
                    </div>
                    {/* Su desktop, la panchina è renderizzata sotto il modulo */}
                    {!isMobile && <BenchPanel reserves={reserves} playerDetails={playerDetails} onDrop={handleDropOnSlot} onSlotClick={handleSlotClick} getRoleIcon={getRoleIcon} selectedSlot={selectedSlot} isPastMatch={isPastMatch} playerStats={playerStats} />}
                </div>
            </div>
        </DndProvider>
    );

    if (isModal) {
        return <div className="formation-modal-container">{content}</div>;
    }

    return (
        <div className="central-box">
            <div className="formation-container">{content}</div></div>
    );
});

// --- DraggablePlayerListItem, BenchPanel, getVoteClass, BenchSlot (Non modificati) ---

const DraggablePlayerListItem = ({ player, getRoleIcon, onPlayerClick, isFutsal }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.PLAYER,
        item: { player },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    return (
        <div ref={drag} className="player-list-item-draggable" style={{ opacity: isDragging ? 0.5 : 1 }} onClick={() => onPlayerClick(player)}>
            <div 
                className="player-list-photo-container"
                // Applichiamo gli stili di sfondo se l'URL è disponibile
                style={player.photo_url ? {
                    backgroundImage: `url(${player.photo_url})`,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize:'200%',
                } : {}} // Altrimenti non applichiamo stili di sfondo
            >
                {/* Se l'URL NON è disponibile, mostriamo l'icona placeholder */}
                {!player.photo_url && (
                    <FontAwesomeIcon icon={faUser} />
                )}
                
                {/* Se l'URL È disponibile, non inseriamo nulla all'interno del div,
                    lasciando lo sfondo visibile. */}
                {!isFutsal && (
                <>
                <div className="player-list-role-icon-overlay">
                    <FontAwesomeIcon icon={getRoleIcon(player.role)} />
                </div>
                {player.second_role && (
                    <div className="player-list-second-role-icon-overlay">
                        <FontAwesomeIcon icon={getRoleIcon(player.second_role)} />
                    </div>
                )}
                    </>
                )}
            </div>
            <span className="player-list-name">{player.name}</span>
        </div>
    );
};

const BenchPanel = ({ reserves, playerDetails, onDrop, onSlotClick, getRoleIcon, selectedSlot, isPastMatch, playerStats }) => {
    return (
        <div className="bench-panel">
            <h4 className="hide-on-mobile">Panchina</h4>
            <div className="bench-slots">
                {reserves.map((playerId, index) => {
                    const player = playerId ? playerDetails[playerId] : null;
                    return <BenchSlot key={index} index={index} player={player} onDrop={onDrop} onSlotClick={onSlotClick} getRoleIcon={getRoleIcon} isSelected={selectedSlot?.type === 'reserve' && selectedSlot?.index === index} isPastMatch={isPastMatch} playerStats={playerStats} />;
                })}
            </div>
        </div>
    );
};

const getVoteClass = (vote) => {
    if (vote === null) return 'vote-sv'; // Senza Voto
    if (vote >= 6.5) return 'vote-good';
    if (vote >= 6.0) return 'vote-sufficient';
    return 'vote-bad';
};

const BenchSlot = ({ index, player, onDrop, onSlotClick, getRoleIcon, isSelected, isPastMatch, playerStats }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.PLAYER,
        drop: (item) => onDrop(item, 'reserve', index, null),
        canDrop: (item) => true, // Permetti sempre il drop per gestire lo scambio
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [onDrop, index]); // Aggiungiamo le dipendenze per sicurezza

    const isActive = isOver && canDrop;
    let slotClass = 'bench-slot';
    if (isActive) {
        slotClass += ' droppable';
    } else if (canDrop) {
        slotClass += ' can-drop';
    }
    if (isSelected) {
        slotClass += ' selected';
    }

    return (
        <div ref={drop} className={slotClass} onClick={() => onSlotClick('reserve', index, player, null)}>
            {player ? (
                <>
                    <div className="player-in-slot-icon hide-on-mobile">
                        <FontAwesomeIcon icon={getRoleIcon(player.role)} /> 
                    </div>
                    <span className="player-in-slot-name">{player.name.split(' ').pop()}</span>
                    {isPastMatch && playerStats[player.id] && (
                        <span className={`player-vote ${getVoteClass(playerStats[player.id].vote)}`}>
                            {playerStats[player.id].vote !== null ? playerStats[player.id].vote.toFixed(1) : 'SV'}
                        </span>
                    )}
                </>
            ) : (
                <FontAwesomeIcon icon={faTshirt} />
            )}
        </div>
    );
};

export default SetFormationPage;
