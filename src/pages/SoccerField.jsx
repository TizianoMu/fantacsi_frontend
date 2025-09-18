import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../utils/dndTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTshirt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const getPositions = (module, rolesOnly = false) => {
    const positions = {
        '2-3-1': rolesOnly ? ['DIFENSORE', 'DIFENSORE', 'CENTROCAMPISTA', 'CENTROCAMPISTA', 'CENTROCAMPISTA', 'ATTACCANTE'] : [
            { top: '85%', left: '30%' }, { top: '85%', left: '70%' }, // Difensori
            { top: '50%', left: '20%' }, { top: '50%', left: '50%' }, { top: '50%', left: '80%' }, // Centrocampisti
            { top: '15%', left: '50%' }  // Attaccante
        ],
        '3-2-1': rolesOnly ? ['DIFENSORE', 'DIFENSORE', 'DIFENSORE', 'CENTROCAMPISTA', 'CENTROCAMPISTA', 'ATTACCANTE'] : [
            { top: '85%', left: '20%' }, { top: '85%', left: '50%' }, { top: '85%', left: '80%' }, // Difensori
            { top: '50%', left: '35%' }, { top: '50%', left: '65%' }, // Centrocampisti
            { top: '15%', left: '50%' }  // Attaccante
        ],
        '3-1-2': rolesOnly ? ['DIFENSORE', 'DIFENSORE', 'DIFENSORE', 'CENTROCAMPISTA', 'ATTACCANTE', 'ATTACCANTE'] : [
            { top: '85%', left: '20%' }, { top: '85%', left: '50%' }, { top: '85%', left: '80%' }, // Difensori
            { top: '60%', left: '50%' }, // Centrocampista
            { top: '25%', left: '35%' }, { top: '25%', left: '65%' }  // Attaccanti
        ]
    };
    return rolesOnly ? positions[module] : [{ top: '95%', left: '50%' }, ...positions[module]]; // Aggiunge il portiere
};

const getRolesForModule = (module) => {
    const roles = {
        '2-3-1': ['PORTIERE', 'DIFENSORE', 'DIFENSORE', 'CENTROCAMPISTA', 'CENTROCAMPISTA', 'CENTROCAMPISTA', 'ATTACCANTE'],
        '3-2-1': ['PORTIERE', 'DIFENSORE', 'DIFENSORE', 'DIFENSORE', 'CENTROCAMPISTA', 'CENTROCAMPISTA', 'ATTACCANTE'],
        '3-1-2': ['PORTIERE', 'DIFENSORE', 'DIFENSORE', 'DIFENSORE', 'CENTROCAMPISTA', 'ATTACCANTE', 'ATTACCANTE']
    };
    return roles[module] || [];
};

const FieldSlot = ({ index, position, player, onDrop, onSlotClick, getRoleIcon, requiredRole, isSelected, isPastMatch, playerStats }) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: ItemTypes.PLAYER,
        drop: (item) => onDrop(item, 'starter', index, requiredRole),
        canDrop: (item) => true,
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [onDrop, index, requiredRole]);

    const isActive = isOver && canDrop;
    let slotClass = 'field-slot';
    if (isActive) slotClass += ' droppable';
    if (isSelected) slotClass += ' selected';

    return (
        <div
            ref={drop}
            className={slotClass}
            style={{ top: position.top, left: position.left }}
            onClick={() => onSlotClick('starter', index, player, requiredRole)}
        >
            {player ? (
                <>
                    {isPastMatch && playerStats[player.id] && (
                        <span className="player-vote on-field">
                            {playerStats[player.id].vote !== null ? playerStats[player.id].vote.toFixed(1) : 'SV'}
                        </span>
                    )}
                    <div className="player-in-slot-icon">
                        <FontAwesomeIcon icon={getRoleIcon(player.role)} />
                    </div>
                    <span className="player-in-slot-name">{player.name.split(' ').pop()}</span>
                </>
            ) : (
                <FontAwesomeIcon icon={faTshirt} />
            )}
        </div>
    );
};

const SoccerField = ({ module, starters, onDrop, onSlotClick, playerDetails, getRoleIcon, selectedSlot, isPastMatch, playerStats }) => {
    const positions = getPositions(module);
    const roles = getRolesForModule(module);

    return (
        <div className="soccer-field">
            {positions.map((pos, index) => {
                const playerId = starters[index];
                const player = playerId ? playerDetails[playerId] : null;
                const requiredRole = roles[index];
                return (
                    <FieldSlot
                        key={index}
                        index={index}
                        position={pos}
                        player={player}
                        onDrop={onDrop}
                        onSlotClick={onSlotClick}
                        getRoleIcon={getRoleIcon}
                        requiredRole={requiredRole}
                        isSelected={selectedSlot?.type === 'starter' && selectedSlot?.index === index}
                        isPastMatch={isPastMatch}
                        playerStats={playerStats}
                    />
                );
            })}
        </div>
    );
};

SoccerField.getPositions = getPositions;

export default SoccerField;