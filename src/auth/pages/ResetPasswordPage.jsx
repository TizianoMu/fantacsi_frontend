import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPasswordConfirm } from '../../api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) {
      setError('Compila tutti i campi.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setError('La password deve contenere almeno 8 caratteri, una minuscola, una maiuscola e un numero.');
      return;
    }
    try {
      await resetPasswordConfirm(token, newPassword);
      setSuccess('Password aggiornata con successo! Ora puoi accedere.');
      setTimeout(() => navigate('/auth'), 2000);
    } catch (err) {
      setError(err.message || 'Errore durante il reset. Riprova.');
    }
  };

  if (!token) {
    return <div className="auth-form"><p className="error-message">Token non valido o scaduto.</p></div>;
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Imposta nuova password</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="form-group password-input-container">
        <label htmlFor="new-password" style={{ marginBottom: '0.35rem', display: 'block' }}>Nuova password:</label>
        <input
          type={showNewPassword ? 'text' : 'password'}
          id="new-password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
          className="input-field"
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
          title="Minimo 8 caratteri, almeno una minuscola, una maiuscola e un numero"
        />
        <span
          className="password-toggle-icon"
          onClick={() => setShowNewPassword(!showNewPassword)}
          role="button"
          aria-label={showNewPassword ? 'Nascondi password' : 'Mostra password'}
        >
          <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
        </span>
      </div>
      <div className="form-group password-input-container">
        <label htmlFor="confirm-password" style={{ marginBottom: '0.35rem', display: 'block' }}>Conferma password:</label>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          id="confirm-password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className="input-field"
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
      <button type="submit" className="btn-primary">Salva nuova password</button>
    </form>
  );
};

export default ResetPasswordPage;