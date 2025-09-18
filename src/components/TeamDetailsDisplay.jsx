import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEdit
} from '@fortawesome/free-solid-svg-icons';
import TeamEmblem from './TeamEmblem';
const TeamDetailsDisplay = ({ teamName, teamLogo, onEdit }) => (
    <> 
        {teamLogo?.shape && (
            <div className="form-group">
                <div className="emblem-preview-display centered-content">
                    <TeamEmblem
                        shape={teamLogo.shape}
                        pattern={teamLogo.pattern}
                        color1={teamLogo.color1}
                        color2={teamLogo.color2}
                        color3={teamLogo.color3}
                        icon={teamLogo.icon}
                        size={80}
                    />
                </div>
            </div>
        )}
        <div className="form-group">
            <label htmlFor="teamName" className='team-name-label-display centered-content bold-text button' title="Modifica squadra" onClick={onEdit}>
                {teamName} <FontAwesomeIcon icon={faEdit} style={{ cursor: 'pointer', marginLeft: '10px' }} />
            </label>
        </div>
    </>
);

export default TeamDetailsDisplay;