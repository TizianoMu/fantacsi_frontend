import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { joinChampionship } from '../api/championships';

const JoinPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [status, setStatus] = useState('Verifica in corso...');
    const [error, setError] = useState('');

    useEffect(() => {
        const joinCode = searchParams.get('code');

        if (!joinCode) {
            setError('Codice di partecipazione non trovato nell\'URL.');
            setStatus('Errore');
            return;
        }

        if (authLoading) return; // Attendi che l'autenticazione sia risolta

        if (isAuthenticated) {
            // Utente loggato, prova a unirsi al campionato
            const attemptJoin = async () => {
                try {
                    setStatus('Partecipazione al campionato in corso...');
                    const joinResponse = await joinChampionship(joinCode);
                    const { championship: joinedChampionship, status: joinStatus } = joinResponse; 
                    setStatus('Successo! Reindirizzamento in corso...');
                    const message = joinStatus === 'already_member'
                        ? 'Sei già un membro di questo campionato.'
                        : `Benvenuto nel campionato ${joinedChampionship.name}!`;
                    navigate(`/championships/${joinedChampionship.id}/dashboard`, { replace: true, state: { welcomeMessage: message } });
                } catch (err) {
                    setError(err.message || 'Impossibile partecipare. Il codice potrebbe non essere valido o sei già un membro.');
                    setStatus('Errore');
                }
            };
            attemptJoin();
        } else {
            // Utente non loggato, salva il codice e reindirizza al login
            localStorage.setItem('pendingJoinCode', joinCode);
            setStatus('Devi accedere per unirti al campionato. Reindirizzamento...');
            navigate('/auth', { replace: true });
        }

    }, [searchParams, isAuthenticated, authLoading, navigate]);

    return (
        <div className="central-box">
            <div className="loading-container" style={{ padding: '2rem' }}>
                {error ? <p className="error-message">{error}</p> : <div className="loading-spinner"></div>}
                <p style={{ marginTop: '1rem' }}>{status}</p>
            </div>
        </div>
    );
};

export default JoinPage;