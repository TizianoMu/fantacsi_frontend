// frontend/src/api/auth.js
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Esegue il login dell'utente.
 * @param {string} identifier Username o email.
 * @param {string} password Password.
 * @returns {Promise<object>} I dati di accesso, incluso il token.
 */
export const loginUser = async (identifier, password) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            username: identifier,
            password: password,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Credenziali non valide');
    }
    return response.json();
};

/**
 * Registra un nuovo utente.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} I dati dell'utente registrato.
 */
export const registerUser = async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Errore durante la registrazione');
    }
    return response.json();
};

/**
 * Invia il token di conferma email al backend per l'attivazione dell'utente.
 * @param {string} token Il token di conferma dall'URL.
 * @returns {Promise<object>} I dati dell'utente attivato.
 */
export const confirmEmail = async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/confirm-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Errore durante la conferma dell'email.");
    }

    return await response.json();
};

export const resetPassword = async (email) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Password reset failed');
  }
  return response.json();
};

export const resetPasswordConfirm = async (token, newPassword) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password-confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  if (!response.ok) throw new Error((await response.json()).detail || 'Errore');
  return response.json();
};