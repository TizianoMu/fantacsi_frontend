import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';

const InviteOptions = ({ championshipDetails }) => {
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    if (!championshipDetails) {
        return <p>Caricamento dettagli invito...</p>;
    }

    const joinCode = championshipDetails.code;
    // Nota: questo link funzionerà solo se gestisci la rotta /join nella tua app
    const inviteLink = `${window.location.origin}/join?code=${joinCode}`;
    const shareText = `Unisciti al mio campionato "${championshipDetails.name}" su Fantacsi! Usa questo codice: ${joinCode} o clicca sul link: ${inviteLink}`;

    const handleCopy = (textToCopy, setCopiedState) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopiedState(true);
            setTimeout(() => setCopiedState(false), 2000); // Reset dopo 2 secondi
        });
    };

    return (
        <div className="invite-options-container">
            <h4>Codice di Partecipazione</h4>
            <p>Condividi questo codice con i tuoi amici per farli unire al campionato.</p>
            <div className="invite-code-box">
                <span>{joinCode}</span>
                <button type="button" onClick={() => handleCopy(joinCode, setCopiedCode)} className="copy-button">
                    <FontAwesomeIcon icon={copiedCode ? faCheck : faCopy} />
                    {copiedCode ? ' Copiato!' : ' Copia'}
                </button>
            </div>

            <h4>Link d'Invito Diretto</h4>
            <p>In alternativa, possono usare questo link per accedere direttamente.</p>
            <div className="invite-link-box">
                <input type="text" value={inviteLink} readOnly />
                <button type="button" onClick={() => handleCopy(inviteLink, setCopiedLink)} className="copy-button">
                    <FontAwesomeIcon icon={copiedLink ? faCheck : faCopy} />
                </button>
            </div>

            <h4>Condividi su</h4>
            <div className="social-share-buttons">
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="social-button whatsapp">
                    <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
                </a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="social-button telegram">
                    <FontAwesomeIcon icon={faTelegram} /> Telegram
                </a>
            </div>
        </div>
    );
};

export default InviteOptions;