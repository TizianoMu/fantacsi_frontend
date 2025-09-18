// frontend/src/api/apiClient.js
import { getToken, removeToken } from '../utils/auth';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';

/**
 * Wrapper per l'API fetch che gestisce l'autenticazione e gli errori 401.
 * @param {string} endpoint L'endpoint dell'API da chiamare (es. '/users/me').
 * @param {object} options Opzioni per la chiamata fetch (method, body, etc.).
 * @returns {Promise<Response>} La risposta della fetch.
 */
export const apiFetch = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        // Token scaduto o non valido.
        removeToken(); // Rimuovi il token non valido.
        // Ricarica l'applicazione. AuthProvider rileverà l'assenza
        // del token e reindirizzerà alla pagina di login.
        window.location.reload(); 
        // Lancia un errore per interrompere l'esecuzione corrente.
        throw new Error("Sessione scaduta. Effettua nuovamente il login.");
    }

    return response;
};