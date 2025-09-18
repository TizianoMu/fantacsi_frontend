const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';
import { getToken } from '../utils/auth';

export const updateUserPassword = async (currentPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me/password`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Errore durante l\'aggiornamento della password.');
    }
    // La risposta 204 non ha corpo
};

export const updateUserEmail = async (newEmail, currentPassword) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me/email`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_email: newEmail, current_password: currentPassword }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Errore durante l\'aggiornamento dell\'email.');
    }
    return response.json();
};

export const fetchUserStats = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me/stats`, {
        headers: {
            'Authorization': `Bearer ${getToken()}`,
        },
    });
    if (!response.ok) throw new Error('Errore nel caricamento delle statistiche.');
    return response.json();
};