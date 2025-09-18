import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, loading } = useAuth();
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (email !== confirmEmail) {
            setError('Le email non corrispondono.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Le password non corrispondono.');
            return;
        }
        if (!passwordRegex.test(password)) {
            setError('La password deve contenere almeno 8 caratteri, una minuscola, una maiuscola e un numero.');
            return;
        }
        try {
            await register(username, email, password);
            setRegistrationSuccess(true); // Imposta lo stato di successo
        } catch (err) {
            setError(err.message || 'Errore durante la registrazione. Riprova.');
        }
    };

    if (registrationSuccess) {
        return (
            <div className="auth-form" style={{ textAlign: 'center' }}>
                <h3 style={{ color: 'var(--primary-color)' }}>Registrazione completata!</h3>
                <p>
                    Ti abbiamo inviato un'email all'indirizzo <strong>{email}</strong>.
                </p>
                <p>
                    Clicca sul link di conferma per attivare il tuo account e poter accedere.
                </p>
            </div>
        );
    }

    return (
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="on">
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <label htmlFor="register-username">Username:</label>
                <input
                    type="text"
                    id="register-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="input-field"
                    disabled={loading}
                    autoComplete="username"
                />
            </div>
            <div className="form-group">
                <label htmlFor="register-email">Email:</label>
                <input
                    type="email"
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                    disabled={loading}
                    autoComplete="email"
                />
            </div>
            <div className="form-group">
                <label htmlFor="register-confirm-email">Conferma Email:</label>
                <input
                    type="email"
                    id="register-confirm-email"
                    value={confirmEmail}
                    onChange={(e) => setConfirmEmail(e.target.value)}
                    required
                    className="input-field"
                    disabled={loading}
                    autoComplete="email"
                />
            </div>
            <div className="form-group password-input-container">
                <label htmlFor="register-password">Password:</label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                    disabled={loading}
                    autoComplete="new-password"
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                />
                <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    role="button"
                    aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
                >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
            </div>
            <div className="form-group password-input-container">
                <label htmlFor="confirm-password">Conferma Password:</label>
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="input-field"
                    disabled={loading}
                    autoComplete="new-password"
                />
                <span
                    className="password-toggle-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    role="button"
                    aria-label={showConfirmPassword ? 'Nascondi password' : 'Mostra password'}
                >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </span>
            </div>
            <small style={{ color: '#ef7821' }}>
                Minimo 8 caratteri, almeno una minuscola, una maiuscola e un numero
            </small>
            <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                    <><FontAwesomeIcon icon={faSpinner} spin /> Registrazione...</>
                ) : (
                    'Registrati'
                )}
            </button>
        </form>
    );
};

export default RegisterForm;