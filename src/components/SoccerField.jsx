import React from 'react';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { ItemTypes } from '../utils/dndTypes';

const SoccerField = ({
    module,
    starters,
    onDrop,
    onSlotClick,
    playerDetails,
    getRoleIcon,
    selectedSlot,
    isPastMatch, 
    playerStats,
    isFutsal,
}) => {
    const fieldColor = '#eb9a26';
    const lineColor = '#fff8ec';

    const getPositions = (module) => {
        // Definizioni complete dei moduli
        const positions = {
            // Calcio a 5
            '3-1': [
                { x: 50, y: 86, role: 'PORTIERE' }, // GK
                { x: 25, y: 70, role: 'DIFENSORE' }, { x: 50, y: 70, role: 'DIFENSORE' }, { x: 75, y: 70, role: 'DIFENSORE' }, // DEF
                { x: 50, y: 45, role: 'ATTACCANTE' }  // FWD
            ],
            '1-3': [
                { x: 50, y: 86, role: 'PORTIERE' }, // GK
                { x: 50, y: 70, role: 'DIFENSORE' }, // DEF
                { x: 25, y: 45, role: 'CENTROCAMPISTA' }, { x: 50, y: 45, role: 'CENTROCAMPISTA' }, { x: 75, y: 45, role: 'CENTROCAMPISTA' }, // MID
            ],
            '2-2': [
                { x: 50, y: 86, role: 'PORTIERE' }, // GK
                { x: 35, y: 70, role: 'DIFENSORE' }, { x: 65, y: 70, role: 'DIFENSORE' },
                { x: 35, y: 45, role: 'CENTROCAMPISTA' }, { x: 65, y: 45, role: 'CENTROCAMPISTA' },
            ],
            // Calcio a 7 (moduli originali rinominati per coerenza)
            '3-2-1': [
                { x: 50, y: 86, role: 'PORTIERE' }, // GK
                { x: 25, y: 70, role: 'DIFENSORE' }, { x: 50, y: 70, role: 'DIFENSORE' }, { x: 75, y: 70, role: 'DIFENSORE' }, // DEF
                { x: 35, y: 45, role: 'CENTROCAMPISTA' }, { x: 65, y: 45, role: 'CENTROCAMPISTA' }, // MID
                { x: 50, y: 20, role: 'ATTACCANTE' }  // FWD
            ],
            '2-3-1': [
                { x: 50, y: 86, role: 'PORTIERE' }, // GK
                { x: 35, y: 70, role: 'DIFENSORE' }, { x: 65, y: 70, role: 'DIFENSORE' }, // DEF
                { x: 25, y: 45, role: 'CENTROCAMPISTA' }, { x: 50, y: 45, role: 'CENTROCAMPISTA' }, { x: 75, y: 45, role: 'CENTROCAMPISTA' }, // MID
                { x: 50, y: 20, role: 'ATTACCANTE' }  // FWD
            ],
            // Calcio a 11
            '4-4-2': [
                { x: 50, y: 86, role: 'PORTIERE' }, // GK
                { x: 15, y: 75, role: 'DIFENSORE' }, { x: 40, y: 75, role: 'DIFENSORE' }, { x: 60, y: 75, role: 'DIFENSORE' }, { x: 85, y: 75, role: 'DIFENSORE' }, // DEF
                { x: 15, y: 50, role: 'CENTROCAMPISTA' }, { x: 40, y: 50, role: 'CENTROCAMPISTA' }, { x: 60, y: 50, role: 'CENTROCAMPISTA' }, { x: 85, y: 50, role: 'CENTROCAMPISTA' }, // MID
                { x: 35, y: 25, role: 'ATTACCANTE' }, { x: 65, y: 25, role: 'ATTACCANTE' } // FWD
            ],
            '4-3-3': [
                { x: 50, y: 86, role: 'PORTIERE' }, // GK
                { x: 15, y: 75, role: 'DIFENSORE' }, { x: 40, y: 75, role: 'DIFENSORE' }, { x: 60, y: 75, role: 'DIFENSORE' }, { x: 85, y: 75, role: 'DIFENSORE' }, // DEF
                { x: 25, y: 50, role: 'CENTROCAMPISTA' }, { x: 50, y: 50, role: 'CENTROCAMPISTA' }, { x: 75, y: 50, role: 'CENTROCAMPISTA' }, // MID
                { x: 20, y: 25, role: 'ATTACCANTE' }, { x: 50, y: 25, role: 'ATTACCANTE' }, { x: 80, y: 25, role: 'ATTACCANTE' } // FWD
            ],
        };
        return positions[module] || [];
    };

    const positions = getPositions(module);
    return (
        <div className="soccer-field-container">
            <svg viewBox="0 0 100 100" className="soccer-field-svg">
                {/* Campo */}
                <rect width="100" height="100" fill={fieldColor} />

                {/* Linee (come prima) */}
                <rect x="5" y="5" width="90" height="90" fill="none" stroke={lineColor} strokeWidth="0.5" />
                <line x1="50" y1="5" x2="50" y2="95" stroke={lineColor} strokeWidth="0.5" />
                <circle cx="50" cy="50" r="10" fill="none" stroke={lineColor} strokeWidth="0.5" />
                <circle cx="50" cy="50" r="1" fill={lineColor} />

                {/* Aree di rigore (come prima) */}
                <rect x="20" y="80" width="60" height="15" fill="none" stroke={lineColor} strokeWidth="0.5" />
                <rect x="30" y="90" width="40" height="5" fill="none" stroke={lineColor} strokeWidth="0.5" />
                <rect x="20" y="5" width="60" height="15" fill="none" stroke={lineColor} strokeWidth="0.5" />
                <rect x="30" y="5" width="40" height="5" fill="none" stroke={lineColor} strokeWidth="0.5" />
            </svg>

            <div className="player-slots-overlay">
                {positions.map((pos, index) => {
                    const playerId = starters[index];
                    const player = playerId ? playerDetails[playerId] : null;
                    return <PlayerSlot
                        key={index}
                        index={index}
                        pos={pos}
                        player={player}
                        onDrop={onDrop}
                        onSlotClick={onSlotClick}
                        getRoleIcon={getRoleIcon}
                        isSelected={selectedSlot?.type === 'starter' && selectedSlot?.index === index}
                        isPastMatch={isPastMatch}
                        playerStats={playerStats}
                        isFutsal={isFutsal}
                    />
                })}
            </div>
        </div>
    );
};

// Esporta la funzione per poterla usare in altri componenti
SoccerField.getPositions = (module, rolesOnly = false) => {
    // Nota: L'uso di `new SoccerField({ module }).getPositions(module)` non è corretto in React
    // static methods. Modifico la logica per chiamare la funzione direttamente.
    const positions = {
        // Calcio a 5
        '3-1': [
            { x: 50, y: 86, role: 'PORTIERE' }, { x: 25, y: 70, role: 'DIFENSORE' }, { x: 50, y: 70, role: 'DIFENSORE' }, { x: 75, y: 70, role: 'DIFENSORE' }, { x: 50, y: 45, role: 'ATTACCANTE' }
        ],
        '1-3': [
            { x: 50, y: 86, role: 'PORTIERE' }, { x: 50, y: 70, role: 'DIFENSORE' }, { x: 25, y: 45, role: 'CENTROCAMPISTA' }, { x: 50, y: 45, role: 'CENTROCAMPISTA' }, { x: 75, y: 45, role: 'CENTROCAMPISTA' }
        ],
        '2-2': [
            { x: 50, y: 86, role: 'PORTIERE' }, { x: 35, y: 70, role: 'DIFENSORE' }, { x: 65, y: 70, role: 'DIFENSORE' }, { x: 35, y: 45, role: 'CENTROCAMPISTA' }, { x: 65, y: 45, role: 'CENTROCAMPISTA' }
        ],
        // Calcio a 7
        '3-2-1': [
            { x: 50, y: 86, role: 'PORTIERE' }, { x: 25, y: 70, role: 'DIFENSORE' }, { x: 50, y: 70, role: 'DIFENSORE' }, { x: 75, y: 70, role: 'DIFENSORE' }, { x: 35, y: 45, role: 'CENTROCAMPISTA' }, { x: 65, y: 45, role: 'CENTROCAMPISTA' }, { x: 50, y: 20, role: 'ATTACCANTE' }
        ],
        '2-3-1': [
            { x: 50, y: 86, role: 'PORTIERE' }, { x: 35, y: 70, role: 'DIFENSORE' }, { x: 65, y: 70, role: 'DIFENSORE' }, { x: 25, y: 45, role: 'CENTROCAMPISTA' }, { x: 50, y: 45, role: 'CENTROCAMPISTA' }, { x: 75, y: 45, role: 'CENTROCAMPISTA' }, { x: 50, y: 20, role: 'ATTACCANTE' }
        ],
        // Calcio a 11
        '4-4-2': [
            { x: 50, y: 86, role: 'PORTIERE' }, { x: 15, y: 75, role: 'DIFENSORE' }, { x: 40, y: 75, role: 'DIFENSORE' }, { x: 60, y: 75, role: 'DIFENSORE' }, { x: 85, y: 75, role: 'DIFENSORE' }, { x: 15, y: 50, role: 'CENTROCAMPISTA' }, { x: 40, y: 50, role: 'CENTROCAMPISTA' }, { x: 60, y: 50, role: 'CENTROCAMPISTA' }, { x: 85, y: 50, role: 'CENTROCAMPISTA' }, { x: 35, y: 25, role: 'ATTACCANTE' }, { x: 65, y: 25, role: 'ATTACCANTE' }
        ],
        '4-3-3': [
            { x: 50, y: 86, role: 'PORTIERE' }, { x: 15, y: 75, role: 'DIFENSORE' }, { x: 40, y: 75, role: 'DIFENSORE' }, { x: 60, y: 75, role: 'DIFENSORE' }, { x: 85, y: 75, role: 'DIFENSORE' }, { x: 25, y: 50, role: 'CENTROCAMPISTA' }, { x: 50, y: 50, role: 'CENTROCAMPISTA' }, { x: 75, y: 50, role: 'CENTROCAMPISTA' }, { x: 20, y: 25, role: 'ATTACCANTE' }, { x: 50, y: 25, role: 'ATTACCANTE' }, { x: 80, y: 25, role: 'ATTACCANTE' }
        ],
    };
    const modPositions = positions[module] || [];
    return modPositions.map(p => rolesOnly ? p.role : p);
};


const getVoteColor = (vote) => {
    return '#ffffff';   // Bianco
};

const PlayerSlot = ({ index, pos, player, onDrop, onSlotClick, getRoleIcon, isSelected, isPastMatch, playerStats, isFutsal }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.PLAYER,
        drop: (item) => onDrop(item, 'starter', index, pos.role),
        canDrop: (item) => {
            if (isFutsal) {
                return true; // Nessun vincolo di ruolo nel Calcio a 5
            }
            // Logica di drop invariata per gli altri sport
            if (!player) {
                return (item.player.role === pos.role || item.player.second_role === pos.role);
            }
            return true;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [player, pos.role, onDrop, index, isFutsal]); // AGGIUNTO isFutsal

    const isActive = isOver && canDrop;

    // 1. Definisci le classi dinamiche
    const slotClass = `player-slot-div ${player ? 'filled' : 'empty'} ${isSelected ? 'selected' : ''} ${isActive ? 'can-drop' : ''}`;

    // 2. Aggiungi lo stile per la posizione e lo sfondo
    const backgroundImageStyle = player && player.photo_url ? {
        backgroundImage: `url('${player.photo_url}')`,
        backgroundPosition: 'center', // Centra l'immagine
        backgroundRepeat: 'no-repeat',
        backgroundSize:'200%',
        backgroundColor: 'transparent', // Assicura che l'immagine di sfondo sia visibile
    } : {};

    const combinedStyle = {
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        ...backgroundImageStyle, // Aggiunge gli stili dello sfondo
    };

    // Colore del voto
    const voteColor = isPastMatch && playerStats[player?.id] ? getVoteColor(playerStats[player.id].vote) : 'transparent';
    const voteText = isPastMatch && playerStats[player?.id] ? (playerStats[player.id].vote !== null ? playerStats[player.id].vote.toFixed(1) : 'SV') : '';

    return (
        <div 
            ref={drop} 
            className={slotClass} 
            style={combinedStyle} 
            onClick={() => onSlotClick('starter', index, player, pos.role)}
        >
            {/* Icona del ruolo sopra - sempre presente */}
            {(!isFutsal && player) && (
            <div className="player-role-icon">
                {/* Nasconde l'icona del ruolo se lo slot è vuoto e siamo in Calcio a 5 */}
                
                    <FontAwesomeIcon icon={getRoleIcon(player ? player.role : pos.role)} />
                
            </div>
            )}
            {player && (
                <>
                    {/* Nome del giocatore */}
                    <span className="player-name-text">
                        {player.name.split(' ').pop()}
                    </span>
                    {/* Pulsante di rimozione (solo se NON è una partita passata) */}
                    {!isPastMatch && (
                        <div className="remove-player-icon" onClick={(e) => {
                            e.stopPropagation(); // Evita di attivare onSlotClick
                            onSlotClick('starter', index, player, pos.role); // Rimuove il giocatore
                        }}>
                        </div>
                    )}
                    {/* Voto del giocatore (solo se è una partita passata) */}
                    {isPastMatch && playerStats[player.id] && (
                        <span className={`player-vote`} style={{ backgroundColor: voteColor }}>
                            {voteText}
                        </span>
                    )}
                </>
            )}
        </div>
    );
};

export default SoccerField;
