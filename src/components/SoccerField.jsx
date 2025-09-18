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
    isPastMatch, // Aggiunto
    playerStats  // Aggiunto
}) => {
    const fieldColor = '#eb9a26';
    const lineColor = '#fff8ec';

    const getPositions = (module) => {
        // Definizioni complete dei moduli
        const positions = {
            // Calcio a 5
            '1-2-1': [
                { x: 50, y: 86, role: 'PORTIERE' }, // GK
                { x: 30, y: 65, role: 'DIFENSORE' }, { x: 70, y: 65, role: 'DIFENSORE' }, // DEF
                { x: 50, y: 40, role: 'CENTROCAMPISTA' }, // MID
                { x: 50, y: 15, role: 'ATTACCANTE' }  // FWD
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

                {/* Linee */}
                <rect x="5" y="5" width="90" height="90" fill="none" stroke={lineColor} strokeWidth="0.5" />
                <line x1="50" y1="5" x2="50" y2="95" stroke={lineColor} strokeWidth="0.5" />
                <circle cx="50" cy="50" r="10" fill="none" stroke={lineColor} strokeWidth="0.5" />
                <circle cx="50" cy="50" r="1" fill={lineColor} />

                {/* Aree di rigore */}
                <rect x="20" y="80" width="60" height="15" fill="none" stroke={lineColor} strokeWidth="0.5" />
                <rect x="30" y="90" width="40" height="5" fill="none" stroke={lineColor} strokeWidth="0.5" />
                <rect x="20" y="5" width="60" height="15" fill="none" stroke={lineColor} strokeWidth="0.5" />
                <rect x="30" y="5" width="40" height="5" fill="none" stroke={lineColor} strokeWidth="0.5" />

                {/* Posizioni giocatori */}
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
                    />
                })}
            </svg>
        </div>
    );
};

// Esporta la funzione per poterla usare in altri componenti
SoccerField.getPositions = (module, rolesOnly = false) => {
    return new SoccerField({ module }).getPositions(module).map(p => rolesOnly ? p.role : p);
};

const getVoteColor = (vote) => {
    if (vote === null) return '#aaaaaa'; // Grigio per SV
    if (vote >= 6.5) return '#4caf50';   // Verde
    if (vote >= 6.0) return '#ffffff';   // Bianco
    return '#f44336';                    // Rosso
};

const PlayerSlot = ({ index, pos, player, onDrop, onSlotClick, getRoleIcon, isSelected, isPastMatch, playerStats }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.PLAYER,
        drop: (item) => onDrop(item, 'starter', index, pos.role),
        canDrop: (item) => {
            // Se lo slot è vuoto, controlla il ruolo
            if (!player) {
                return item.player.role === pos.role;
            }
            // Se lo slot è pieno, permetti lo scambio
            return true;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [player, pos.role, onDrop, index]); // Aggiunte dipendenze

    const isActive = isOver && canDrop;
    let strokeColor = '#fff8ec';
    if (isSelected) {
        strokeColor = 'var(--primary-color)';
    } else if (isActive) {
        strokeColor = '#fff';
    }

    const clipId = `clip-${index}`;

    return (
        <g ref={drop} transform={`translate(${pos.x}, ${pos.y})`} className="player-slot-group" onClick={() => onSlotClick('starter', index, player, pos.role)}>
            {player && (
                <>
                    {player.photo_url ? (
                        <>
                            <defs>
                                <clipPath id={clipId}>
                                    <circle r="6" cx="0" cy="0" />
                                </clipPath>
                            </defs>
                            <image
                                href={player.photo_url}
                                x="-6" y="-6" height="12" width="12"
                                clipPath={`url(#${clipId})`}
                                preserveAspectRatio="xMidYMid slice"
                            />
                            <circle r="6" fill="none" stroke="#000" strokeWidth={isSelected || isActive ? "1" : "0.2"} />
                        </>
                    ) : (
                        <circle r="6" fill="#1d282b" stroke={strokeColor} strokeWidth={isSelected || isActive ? "1" : "0.7"} />
                    )}
                    <text
                        y="9" textAnchor="middle" fontSize="3.5" fill="#000"
                        stroke="#fff" strokeWidth="0.19" paintOrder="stroke"
                        style={{ pointerEvents: 'none' }}
                    >
                        {player.name.split(' ').pop()}
                    </text>
                    {isPastMatch && playerStats[player.id] && (
                        <text
                            y="12.5" textAnchor="middle" fontSize="3" fill={getVoteColor(playerStats[player.id].vote)} fontWeight="bold"
                            stroke="#000" strokeWidth="0.19" paintOrder="stroke"
                            style={{ pointerEvents: 'none' }}
                        >
                            {playerStats[player.id].vote !== null ? playerStats[player.id].vote.toFixed(1) : 'SV'}
                        </text>
                    )}
                    <text y="-5" textAnchor="middle" fontSize="3" style={{ pointerEvents: 'none' }}>
                        <FontAwesomeIcon icon={getRoleIcon(player.role)} color="white" />
                    </text>
                </>
            )}
            {!player && (
                <>
                    <circle r="6" fill="rgba(255,255,255,0.3)" stroke={strokeColor} strokeWidth={isSelected || isActive ? "1" : "0.7"} />
                    <text y="1" textAnchor="middle" fontSize="3" fill="white" opacity="0.7" style={{ pointerEvents: 'none' }}>
                        <FontAwesomeIcon icon={getRoleIcon(pos.role)} />
                    </text>
                </>
            )}
        </g>
    );
};

export default SoccerField;
