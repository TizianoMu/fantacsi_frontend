import { createContext, useContext } from 'react';

// Sarà usato per fornire stato e funzioni di autenticazione.
export const AuthContext = createContext({
    user: null, // Oggetto utente (es. { username: 'testuser', id: 1, email: 'test@test.com' })
    token: null, // JWT token
    isAuthenticated: false,
    login: async () => { }, // Funzione per effettuare il login
    logout: () => { },     // Funzione per effettuare il logout
    register: async () => { }, // Funzione per la registrazione
    updateToken: (newToken) => {}, // Funzione per aggiornare il token
    loading: true, // Indica se lo stato di autenticazione è in caricamento
});

// Hook personalizzato per un facile accesso al contesto
export const useAuth = () => {
    return useContext(AuthContext);
};