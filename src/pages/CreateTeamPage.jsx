import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Modal from '../components/Modal';
import { fetchChampionshipDetails } from '../api/championships';
import { getToken, decodeToken } from '../utils/auth';
import { fetchPlayers, fetchTeamPlayers,saveTeam } from '../api/players';
import TeamDetailsForm from '../components/TeamDetailsForm';
import TeamDetailsDisplay from '../components/TeamDetailsDisplay';
import BackButton from '../components/BackButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getRoleIcon } from '../utils/icons';
import {
    faPlus, faUser, faExclamationTriangle, faEdit, faUsers
} from '@fortawesome/free-solid-svg-icons';

const CreateTeamPage = () => {
    const { championshipId } = useParams();
    const [loading, setLoading] = useState(true);
    const [showSelectPlayersModal, setShowSelectPlayersModal] = useState(false);
    const [teamExists, setTeamExists] = useState(false);
    // Stati per la squadra dell'utente
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [teamName, setTeamName] = useState('');
    const [teamLogo, setTeamLogo] = useState({
        shape: 'shield',
        pattern: 'none',
        color1: '#ef7821',
        color2: '#eb9a26',
        color3: '#ffffff',
        icon: 'none'
    });
    const [totalValue, setTotalValue] = useState(0);

    // Stati per il campionato
    const [championshipBudget, setChampionshipBudget] = useState(1000);
    const [championshipName, setChampionshipName] = useState('');
    const [championshipType, setChampionshipType] = useState('CALCIO_7');

    // Stati per la lista di tutti i giocatori disponibili
    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [selectedPlayersInModal, setSelectedPlayersInModal] = useState([]);

    // Stati per gli errori e le segnalazioni
    const [budgetError, setBudgetError] = useState(false);
    const [roleErrors, setRoleErrors] = useState([]);
    const [saveError, setSaveError] = useState('');
    const [isEditing, setIsEditing] = useState(true);

    const [liveBudget, setLiveBudget] = useState(0);
    // Effettua il caricamento iniziale dei dati
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const championshipDetails = await fetchChampionshipDetails(championshipId);
                setChampionshipName(championshipDetails.name);
                setChampionshipBudget(championshipDetails.budget_per_user || 1000);

                const token = getToken();
                const userDetails = decodeToken(token);
                try {
                    // Tenta di caricare la squadra esistente
                    const fetchedTeam = await fetchTeamPlayers(championshipId, userDetails.id);
                    if (fetchedTeam.players) {
                        setTeamExists(true);
                        setIsEditing(false);
                        setTeamName(fetchedTeam.team_name);
                        setTeamLogo({
                            shape: fetchedTeam.logo_shape || 'shield',
                            pattern: fetchedTeam.logo_pattern || 'none',
                            color1: fetchedTeam.logo_color1 || '#ef7821',
                            color2: fetchedTeam.logo_color2 || '#eb9a26',
                            color3: fetchedTeam.logo_color3 || '#ffffff',
                            icon: fetchedTeam.logo_icon || 'none'
                        });
                        // Aggiungi un controllo per i dati dei giocatori
                        setTeamPlayers(fetchedTeam.players || []);
                        setSelectedPlayersInModal(fetchedTeam.players.map(p => p.id));
                    } else {
                        setTeamExists(false);
                        setIsEditing(true);
                    }
                } catch (error) {
                    if (error.message.includes('404')) {
                        setTeamExists(false);
                        setIsEditing(true);
                    } else {
                        throw error;
                    }
                }

                const allPlayersData = await fetchPlayers(championshipId, true);
                setAvailablePlayers(allPlayersData);

            } catch (error) {
                console.error("Errore nel caricamento dei dati:", error);
                setSaveError("Errore nel caricamento dei dati. Riprova più tardi.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [championshipId]);

    // Aggiorna il valore totale della squadra e gli errori sui ruoli
    useEffect(() => {
        setTotalValue(teamPlayers.reduce((acc, player) => acc + player.initial_value, 0));
        checkRoleConstraints(teamPlayers);
    }, [teamPlayers]);

    // Funzione per calcolare gli errori sui ruoli
    const checkRoleConstraints = (players) => {
        const roles = {
            'PORTIERE': 0, 'DIFENSORE': 0, 'CENTROCAMPISTA': 0, 'ATTACCANTE': 0
        };
        players.forEach(p => roles[p.role]++);
        const errors = [];
        if (roles['PORTIERE'] < 1) errors.push('Portiere');
        if (roles['DIFENSORE'] < 1) errors.push('Difensore');
        if (roles['CENTROCAMPISTA'] < 1) errors.push('Centrocampista');
        if (roles['ATTACCANTE'] < 1) errors.push('Attaccante');
        setRoleErrors(errors);
    };

    useEffect(() => {
        setTotalValue(teamPlayers.reduce((acc, player) => acc + player.initial_value, 0));
        checkRoleConstraints(teamPlayers);
    }, [teamPlayers]);

    const handleOpenSelectPlayersModal = () => {
        // Inizializza i giocatori selezionati nel modale con quelli già in squadra
        setSelectedPlayersInModal(teamPlayers.map(p => p.id));
        setLiveBudget(teamPlayers.reduce((acc, p) => acc + p.initial_value, 0));
        setShowSelectPlayersModal(true);
    };

    const handlePlayerSelection = (playerId, value, isSelected) => {
        const currentPlayer = availablePlayers.find(p => p.id === playerId);
        if (!currentPlayer) return;
        setSelectedPlayersInModal(prev =>
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : [...prev, playerId]
        );
        let newLiveBudget = liveBudget + (isSelected ? value : -value);
        setLiveBudget(newLiveBudget);
        if (championshipBudget - newLiveBudget < 0) {
            setBudgetError(true);
        } else {
            setBudgetError(false);
        }
    };

    const handleSavePlayers = async (e) => {
        e.preventDefault();
        const newTeamPlayers = availablePlayers.filter(p => selectedPlayersInModal.includes(p.id));
        const newTotalValue = newTeamPlayers.reduce((acc, player) => acc + player.initial_value, 0);

        if (newTotalValue > championshipBudget) {
            setBudgetError(true);
            return;
        }

        setBudgetError(false);
        setLiveBudget(0);
        setTeamPlayers(newTeamPlayers);
        setShowSelectPlayersModal(false);
    };

    const handleSaveTeam = async () => {
        setSaveError('');
        
        // Validazione dei dati
        if (!teamName) {
            setSaveError("Il nome della squadra è obbligatorio.");
            return;
        }

        const newTeamPlayers = availablePlayers.filter(p => selectedPlayersInModal.includes(p.id));
        const newTotalValue = newTeamPlayers.reduce((acc, player) => acc + player.initial_value, 0);

        if (newTotalValue > championshipBudget) {
            setBudgetError(true);
            setSaveError("Il costo totale dei giocatori supera il budget disponibile.");
            return;
        }
        
        const token = getToken();
        const userDetails = decodeToken(token);
        const playerIds = newTeamPlayers.map(p => p.id);

        try {
            const dataToSave = {
                name: teamName,
                player_ids: playerIds,
                logo_shape: teamLogo.shape,
                logo_pattern: teamLogo.pattern,
                logo_color1: teamLogo.color1,
                logo_color2: teamLogo.color2,
                logo_color3: teamLogo.color3,
                logo_icon: teamLogo.icon
            };
            const savedTeam = await saveTeam(championshipId, userDetails.id, dataToSave);
            setTeamPlayers(newTeamPlayers);
            setTeamExists(true);
            setIsEditing(false);
            setShowSelectPlayersModal(false);
            setSaveError('');
        } catch (error) {
            console.error("Errore nel salvataggio:", error);
            setSaveError(error.message);
        }
    };

    return (
        <div className="central-box">
            <div className="add-players-container create-team-page">
                <BackButton />
                <div className="create-team-header">
                    <h2 className="title">{championshipName}</h2>
                </div>
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Caricamento squadra...</p>
                    </div>
                ) : (
                    <>
                        {/* Sezione per nome e stemma della squadra */}
                        <div className="team-details-section">
                            {teamExists && !isEditing ? (
                                <TeamDetailsDisplay teamName={teamName} teamLogo={teamLogo} onEdit={() => setIsEditing(true)} />
                            ) : (
                                <TeamDetailsForm
                                    teamName={teamName}
                                    setTeamName={setTeamName}
                                    teamLogo={teamLogo}
                                    setTeamLogo={setTeamLogo}
                                />
                            )}
                        </div>

                        <div className="team-summary">
                            <div className="team-stats">
                                <p>Budget Disponibile:
                                    <span className={`budget-value ${budgetError ? 'budget-error' : ''}`}>
                                        {championshipBudget - totalValue}
                                    </span>
                                </p>
                                {roleErrors.length > 0 && (
                                    <div className="warning-message">
                                        <FontAwesomeIcon icon={faExclamationTriangle} /> Attenzione, mancano giocatori nei seguenti ruoli:
                                        <ul className="role-errors-list">
                                            {roleErrors.map((error, index) => <li key={index}>{error}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="players-container">
                           {teamPlayers.map((player) => (
                                    <div key={player.id} className="player-item">
                                        <div 
                                            className="player-circle"
                                            // Applicazione degli stili per l'immagine di sfondo
                                            style={player.photo_url ? {
                                                backgroundImage: `url(${player.photo_url})`,
                                                backgroundPosition: 'center',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundSize:'200%',
                                            } : {}} // Se non c'è URL, non applichiamo stili extra
                                        >
                                            {/* Se non c'è l'URL della foto, mostriamo l'icona placeholder */}
                                            {!player.photo_url && (
                                                <div className="player-placeholder">
                                                    {/* Mantieni il placeholder esistente */}
                                                    <FontAwesomeIcon icon={faUser} size="2x" />
                                                </div>
                                            )}
                                            
                                            {/* Rimuovi il vecchio tag <img> */}
                                            
                                            <div className="role-label">
                                                <FontAwesomeIcon icon={getRoleIcon(player.role)} />
                                            </div>
                                            <div className="value-label">
                                                {player.initial_value}
                                            </div>
                                        </div>
                                        <div className="player-label">
                                            <span>{player.name}</span>
                                        </div>
                                    </div>
                                ))}
                                {isEditing && (
                                    <button className="add-player-button button" onClick={handleOpenSelectPlayersModal}>
                                        <FontAwesomeIcon icon={teamExists ? faEdit : faPlus} />
                                    </button>
                                )}
                        </div>
                    </>
                )}
                {isEditing && (
                    <>
                    <button type="submit" className="btn-primary" onClick={handleSaveTeam}>Salva</button>
                    {saveError && <p className="error-message">{saveError}</p>}
                    </>
                )}
            </div>

            {/* Modale per la selezione dei giocatori */}
            <Modal
                show={showSelectPlayersModal}
                onClose={() => { setShowSelectPlayersModal(false); setBudgetError(false); setLiveBudget(0); }}
                title={
                    <>
                        Seleziona i giocatori della tua squadra
                            <span className={`budget-counter budget-value`}>
                                <span className={`${budgetError ? 'budget-error' : ''}`}>{liveBudget}</span> / {championshipBudget}
                            </span>
                    </>
                }
                icon={<FontAwesomeIcon icon={faUsers} />}
                actions={{
                    onSubmit: handleSavePlayers,
                    buttons: (
                        <>
                            <button type="button" className="button cancel" onClick={() => { setShowSelectPlayersModal(false); setBudgetError(false); }}>
                                Annulla
                            </button>
                            <button type="submit" className="button save" disabled={budgetError}>
                                Salva
                            </button>
                        </>
                    ),
                    errorMessage: budgetError ? "Il costo totale dei giocatori supera il budget disponibile." : ''
                }}
            >
                <div className="players-list-modal">
                    {availablePlayers.length > 0 ? (
                        availablePlayers.map(player => (
                            <div key={player.id} className="player-list-item">
                                <div className="player-info-section">
                                    <input
                                        type="checkbox"
                                        id={`player-${player.id}`}
                                        checked={selectedPlayersInModal.includes(player.id)}
                                        onChange={(e) => handlePlayerSelection(player.id, player.initial_value,e.target.checked)}
                                        name={`player-${player.id}`}
                                    />
                                    <label htmlFor={`player-${player.id}`} className="player-info-label">
                                        <div className="player-info">
                                            <span className="player-name">{player.name}</span>
                                            <span className="player-role"><FontAwesomeIcon icon={getRoleIcon(player.role)} /> {player.role.toLowerCase()}</span>
                                        </div>
                                    </label>
                                </div>
                                <div className="player-value-section">
                                    <span className="player-value">{player.initial_value}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nessun giocatore disponibile.</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default CreateTeamPage;
