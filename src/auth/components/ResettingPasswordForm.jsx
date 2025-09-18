import React, { useState } from 'react';
import { resetPassword } from '../../api/auth';

const ResettingPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSending(true);
    setSent(false);
    try {
      await resetPassword(email);
      setSuccess('Email inviata! Controlla la tua casella di posta per il link di reset.');
      setSent(true);
    } catch (err) {
      setError(err.message || 'Errore durante il reset della password. Riprova.');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} autoComplete="on">
      <div className="form-group">
        <label htmlFor="reset-email">Email:</label>
        <input
          type="email"
          id="reset-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
          autoComplete="email"
          disabled={sending || sent}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button type="submit" className="btn-primary" disabled={sending || sent}>
        {sending ? 'Invio in corso...' : sent ? 'Email inviata!' : 'Resetta Password'}
      </button>
    </form>
  );
};

export default ResettingPasswordForm;