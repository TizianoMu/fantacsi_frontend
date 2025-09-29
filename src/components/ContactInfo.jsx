// frontend/src/components/ContactInfo.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente che visualizza le informazioni di contatto.
 * Utilizza la classe 'auth-form' per l'aspetto del contenitore e 
 * 'form-group' per l'aspetto delle singole voci, come nei form di autenticazione.
 */
const ContactInfo = () => {
    
    const emailContatto = 'fantacsileague@gmail.com'; // Sostituisci con l'email reale

    return (
        <div className="auth-form" style={{ textAlign: 'left' }}>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-color, #333)' }}>
                Per qualsiasi domanda o supporto, non esitare a contattarci. 
                Saremo lieti di aiutarti!
            </p>
            <div className="form-group">
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem', color: 'var(--primary-color, #007bff)' }} /> 
                    Email di Contatto:
                </label>
                <div 
                    className="input-field"
                    style={{
                        padding: '10px 15px', 
                        backgroundColor: 'var(--input-bg-color, #f9f9f9)', 
                        border: '1px solid var(--input-border-color, #ccc)',
                        borderRadius: 'var(--input-border-radius, 4px)',
                        cursor: 'text',
                        wordBreak: 'break-all'
                    }}
                >
                    <a href={`mailto:${emailContatto}`} style={{ textDecoration: 'none', color: 'var(--primary-color, #007bff)' }}>
                        <strong>{emailContatto}</strong>
                    </a>
                </div>
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted-color, #666)' }}>
                Risponderemo alla tua email il prima possibile.
            </p>
        </div>
    );
};

export default ContactInfo;
