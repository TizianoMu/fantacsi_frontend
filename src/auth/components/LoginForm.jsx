import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Errore durante il login. Riprova.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} autoComplete="on">
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label htmlFor="login-username">Username o Email:</label>
        <input
          type="text"
          id="login-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-field"
          autoComplete="username"
        />
      </div>
      <div className="form-group password-input-container">
        <label htmlFor="login-password">Password:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
          autoComplete="current-password"
        />
        <span
          className="password-toggle-icon"
          onClick={togglePasswordVisibility}
          role="button"
          aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? (
          <><FontAwesomeIcon icon={faSpinner} spin /> Accesso in corso...</>
        ) : (
          'Accedi'
        )}
      </button>
    </form>
  );
};

export default LoginForm;