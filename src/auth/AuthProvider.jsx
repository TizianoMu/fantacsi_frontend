// frontend/src/auth/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { loginUser, registerUser } from '../api/auth'; // Useremo queste funzioni
import { decodeToken, getToken, removeToken, setToken, isTokenExpired } from '../utils/auth'; // Utility per token
import { useNavigate } from 'react-router-dom';
import { joinChampionship } from '../api/championships';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Per gestire il caricamento iniziale

  const navigate = useNavigate(); // Hook per la navigazione

  // Funzione per impostare il token e l'utente nel contesto
  const updateAuth = (jwtToken) => {
    if (jwtToken && !isTokenExpired(jwtToken)) {
      setToken(jwtToken); // Salva nel localStorage
      const decodedUser = decodeToken(jwtToken);
      if (decodedUser && decodedUser.sub && decodedUser.id) {
        // Usiamo la forma funzionale di setState per non dipendere dallo stato esterno
        // e garantire che gli aggiornamenti siano sempre atomici e corretti.
        setUser({ username: decodedUser.sub, id: decodedUser.id, email: decodedUser.email });
        setAuthToken(jwtToken);
        setIsAuthenticated(true);
      } else {
        // Token non valido, pulisci lo stato
        removeToken();
        setUser(null);
        setAuthToken(null);
        setIsAuthenticated(false);
        navigate('/auth', { replace: true });
      }
    } else {
      removeToken();
      setUser(null);
      setAuthToken(null);
      setIsAuthenticated(false);
      // Se c'era un token ma è scaduto, reindirizza al login
      if (jwtToken) {
        navigate('/auth', { replace: true });
      }
    }
  };

  // Inizializzazione: Controlla il token al caricamento dell'app
  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      // La funzione updateAuth gestirà da sola il caso di token scaduto,
      // pulendo lo stato e reindirizzando se necessario.
      updateAuth(storedToken);
    }
    setLoading(false);
  }, []); // Esegui solo una volta al montaggio del componente

  const login = async (username, password) => {
    try {
      setLoading(true);
      const data = await loginUser(username, password);
      
      // Controlla se c'è un codice di invito in sospeso
      const pendingJoinCode = localStorage.getItem('pendingJoinCode');
      if (pendingJoinCode) {
        try {
          const joinResponse = await joinChampionship(pendingJoinCode);
          const { championship: joinedChampionship, status: joinStatus } = joinResponse;
          updateAuth(data.access_token); // Aggiorna l'autenticazione prima di navigare
          localStorage.removeItem('pendingJoinCode'); // Rimuovi il codice dopo averlo usato

          const message = joinStatus === 'already_member'
            ? 'Sei già un membro di questo campionato.'
            : `Benvenuto nel campionato ${joinedChampionship.name}!`;
          navigate(`/championships/${joinedChampionship.id}/dashboard`, { replace: true, state: { welcomeMessage: message } });
        } catch (error) {
          const decodedUser = decodeToken(data.access_token);
          updateAuth(data.access_token);
          navigate('/championships', { state: { welcomeMessage: `Benvenuto, ${decodedUser.sub}! Non è stato possibile unirsi: ${error.message}` } });
        }
      } else {
        // Flusso di login normale
        updateAuth(data.access_token);
        navigate('/championships', { state: { welcomeMessage: `Benvenuto, ${decodeToken(data.access_token).sub}!` } });
      }
    } catch (error) {
      console.error("Login failed:", error);
      updateAuth(null); // Pulisci lo stato in caso di errore
      throw error; // Rilancia l'errore per gestirlo nel form
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      setLoading(true);
      const registeredUser = await registerUser(username, email, password);
      // Non eseguiamo più il login automatico.
      return registeredUser; // Restituiamo l'utente per mostrare un messaggio di successo.
    } catch (error) {
      console.error("Registration failed:", error);
      updateAuth(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    updateAuth(null);
    navigate('/auth'); // Reindirizza alla pagina di login
  };

  const contextValue = {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    register,
    updateToken: updateAuth, // Usiamo la funzione updateAuth esistente che fa già quello che ci serve
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};