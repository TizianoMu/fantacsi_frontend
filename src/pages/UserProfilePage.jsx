import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { updateUserEmail, updateUserPassword, fetchUserStats } from '../api/user';
import BackButton from '../components/BackButton';
import Notification from '../components/calendar/Notification';

const UserProfilePage = () => {
    const { user, updateToken } = useAuth();

    // Stati per il form dell'email
    const [newEmail, setNewEmail] = useState(user?.email || '');
    const [emailPassword, setEmailPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailSuccess, setEmailSuccess] = useState('');

    // Stati per il form della password
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    const [showEmailPassword, setShowEmailPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [activeForm, setActiveForm] = useState(null); // 'email', 'password', o null
    const [stats, setStats] = useState(null);

    // Effetto per nascondere i messaggi di successo dopo un po'
    useEffect(() => {
        if (emailSuccess || passwordSuccess) {
            const timer = setTimeout(() => {
                setEmailSuccess('');
                setPasswordSuccess('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [emailSuccess, passwordSuccess]);

    // Effetto per caricare le statistiche
    useEffect(() => {
        const loadStats = async () => {
            try {
                const userStats = await fetchUserStats();
                setStats(userStats);
            } catch (error) {
                console.error("Errore caricamento statistiche:", error);
            }
        };
        loadStats();
    }, []);

    const handleEmailUpdate = async (e) => {
        e.preventDefault();
        setEmailError('');
        setEmailSuccess('');
        if (!newEmail || !emailPassword) {
            setEmailError('Tutti i campi sono obbligatori.');
            return;
        }
        setLoading(true);
        try {
            const response = await updateUserEmail(newEmail, emailPassword);
            // Il backend restituisce un nuovo token. Lo usiamo per aggiornare la sessione.
            updateToken(response.access_token);
            setEmailSuccess('Email aggiornata con successo!');            
            setActiveForm(null); // Chiude il form
            setEmailPassword('');
        } catch (error) {
            setEmailError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        if (newPassword !== confirmNewPassword) {
            setPasswordError('Le nuove password non corrispondono.');
            return;
        }
        if (!currentPassword || !newPassword) {
            setPasswordError('Tutti i campi sono obbligatori.');
            return;
        }
        setLoading(true);
        try {
            await updateUserPassword(currentPassword, newPassword);
            setPasswordSuccess('Password aggiornata con successo!');
            setActiveForm(null); // Chiude il form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            setPasswordError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="central-box">
            <div className="add-players-container">
                <BackButton />
                <h2 className="title">Il Mio Profilo</h2>

                {/* Sezione Dati Utente */}
                <div className="profile-section">
                    <h3>I miei dati</h3>
                    <div className="profile-data-grid">
                        <div className="data-item">
                            <span className="data-label">Username</span>
                            <span className="data-value">{user?.username}</span>
                        </div>
                        <div className="data-item">
                            <span className="data-label">Email</span>
                            <span className="data-value">{user?.email}</span>
                        </div>
                    </div>
                </div>

                {/* Sezione Statistiche */}
                {stats && (
                    <div className="profile-section">
                        <h3>Le mie statistiche</h3>
                        <div className="profile-data-grid">
                            <div className="data-item">
                                <span className="data-label">Membro dal</span>
                                <span className="data-value">{new Date(stats.member_since).toLocaleDateString('it-IT')}</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Campionati</span>
                                <span className="data-value">{stats.participated_championships}</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Di cui Amministrati</span>
                                <span className="data-value">{stats.administered_championships}</span>
                            </div>
                        </div>
                    </div>
                )}


                {/* Sezione Azioni */}
                <div className="profile-section">
                    <h3>Gestisci Account</h3>
                    <div className="profile-actions">
                        <button className="button" onClick={() => setActiveForm(activeForm === 'email' ? null : 'email')}>
                            Modifica Email
                        </button>
                        <button className="button" onClick={() => setActiveForm(activeForm === 'password' ? null : 'password')}>
                            Modifica Password
                        </button>
                    </div>
                </div>

                {/* Form dinamici */}
                {activeForm === 'email' && (
                    <form onSubmit={handleEmailUpdate} className="profile-form">
                        {emailError && <p className="error-message">{emailError}</p>}
                        <div className="form-group">
                            <label htmlFor="email">Nuova Email</label>
                            <input type="email" id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="input-field" required />
                        </div>
                        <div className="form-group password-input-container">
                            <label htmlFor="email-password">Password Attuale (per conferma)</label>
                            <input type={showEmailPassword ? 'text' : 'password'} id="email-password" value={emailPassword} onChange={(e) => setEmailPassword(e.target.value)} className="input-field" required />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowEmailPassword(!showEmailPassword)}
                            >
                                <FontAwesomeIcon icon={showEmailPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                        <button type="submit" className="button save" disabled={loading}>{loading ? 'Aggiornamento...' : 'Salva Email'}</button>
                    </form>
                )}

                {activeForm === 'password' && (
                    <form onSubmit={handlePasswordUpdate} className="profile-form">
                        {passwordError && <p className="error-message">{passwordError}</p>}
                        <div className="form-group password-input-container">
                            <label htmlFor="current-password">Password Attuale</label>
                            <input type={showCurrentPassword ? 'text' : 'password'} id="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" required />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                        <div className="form-group password-input-container">
                            <label htmlFor="new-password">Nuova Password</label>
                            <input type={showNewPassword ? 'text' : 'password'} id="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" required />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                        <div className="form-group password-input-container">
                            <label htmlFor="confirm-new-password">Conferma Nuova Password</label>
                            <input type={showConfirmNewPassword ? 'text' : 'password'} id="confirm-new-password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="input-field" required />
                            <span
                                className="password-toggle-icon"
                                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                            >
                                <FontAwesomeIcon icon={showConfirmNewPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>
                        <button type="submit" className="button save" disabled={loading}>{loading ? 'Aggiornamento...' : 'Salva Password'}</button>
                    </form>
                )}

                {/* Notifiche di successo */}
                <Notification show={!!emailSuccess} message={emailSuccess} />
                <Notification show={!!passwordSuccess} message={passwordSuccess} />
            </div>
        </div>
    );
};

export default UserProfilePage;