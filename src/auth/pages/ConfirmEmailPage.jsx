import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { confirmEmail } from '../../api/auth';

const ConfirmEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [message, setMessage] = useState('Conferma email in corso...');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Token di conferma non trovato. Assicurati di aver cliccato il link corretto.');
            return;
        }

        const processConfirmation = async () => {
            try {
                await confirmEmail(token);
                setStatus('success');
                // Reindirizza alla pagina di login con un messaggio di successo
                navigate('/auth', { 
                    replace: true, 
                    state: { successMessage: 'Email confermata con successo! Ora puoi accedere.' } 
                });
            } catch (error) {
                setStatus('error');
                setMessage(error.message || 'Si è verificato un errore. Il token potrebbe essere scaduto o non valido.');
            }
        };

        processConfirmation();
    }, [searchParams, navigate]);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <div className="loading-spinner" style={{ margin: '0 auto 2rem auto' }}></div>
                        <p>{message}</p>
                    </>
                );
            case 'error':
                return (
                    <div className="auth-form">
                        <h3 style={{ color: 'var(--text-error-message)', textAlign: 'center' }}>Errore di Conferma</h3>
                        <p className="error-message">{message}</p>
                        <Link to="/auth" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                            Torna al Login
                        </Link>
                    </div>
                );
            default:
                return <p>Reindirizzamento in corso...</p>;
        }
    };

    return <div className="central-box" style={{ textAlign: 'center' }}>{renderContent()}</div>;
};

export default ConfirmEmailPage;