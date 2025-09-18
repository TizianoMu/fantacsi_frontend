import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import EmblemCreator from './EmblemCreator';
import Modal from '../components/Modal';
import TeamEmblem from './TeamEmblem';
const TeamDetailsForm = ({ teamName, setTeamName, teamLogo, setTeamLogo }) => {
    const [showEmblemModal, setShowEmblemModal] = useState(false);
    const [tempLogo, setTempLogo] = useState(teamLogo);

    // Sincronizza lo stato temporaneo quando il modale si apre
    useEffect(() => {
        if (showEmblemModal) {
            setTempLogo(teamLogo);
        }
    }, [showEmblemModal, teamLogo]);

    const handleTempLogoChange = (prop, value) => {
        setTempLogo(prev => ({ ...prev, [prop]: value }));
    };

    const handleSaveLogo = () => {
        // Applica le modifiche temporanee allo stato reale
        setTeamLogo(tempLogo);
        setShowEmblemModal(false);
    }

    return (
    <>
        <div className="form-group">
            {teamLogo?.shape && (
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
            )}
            <button
                type="button"
                className="button centered-content"
                onClick={() => setShowEmblemModal(true)}
            >
                Modifica il tuo stemma
            </button>
            
        </div>
        <div className="form-group">
            <label htmlFor="teamName">
                Nome Squadra <span style={{ color: 'red' }}>*</span>
            </label>
            <input
                id="teamName"
                className="input-field"
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Inserisci il nome della squadra"
                required
            />
        </div>
        <Modal
            show={showEmblemModal}
            onClose={() => setShowEmblemModal(false)}
            title={
                <>
                    Modifica il tuo stemma
                </>
            }
            icon={<FontAwesomeIcon icon={faShieldAlt} />}
            actions={{
                onSubmit: handleSaveLogo,
                buttons: (
                    <>
                        <button type="button" className="button cancel" onClick={() => setShowEmblemModal(false)}>
                            Annulla
                        </button>
                        <button type="submit" className="button save">
                            Salva
                        </button>
                    </>
                ),
            }}
        >
            <EmblemCreator
                shape={tempLogo.shape}
                pattern={tempLogo.pattern}
                color1={tempLogo.color1}
                color2={tempLogo.color2}
                color3={tempLogo.color3}
                icon={tempLogo.icon}
                onPropChange={handleTempLogoChange}
            />
        </Modal>
    </>
);
}
export default TeamDetailsForm;