import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className="back-button" title="Indietro">
            <FontAwesomeIcon icon={faArrowLeft} />
        </button>
    );
};

export default BackButton;