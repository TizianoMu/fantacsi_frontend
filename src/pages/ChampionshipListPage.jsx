// frontend/src/pages/ChampionshipListPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Modal from '../components/Modal'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faPlus, faCrown, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { fetchMyChampionships, joinChampionship } from '../api/championships';
import { decodeStatus, getStatusClass } from '../utils/status';

const ChampionshipListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Stato per il messaggio di benvenuto
  
  const [welcomeMessage, setWelcomeMessage] = useState(location.state?.welcomeMessage);

  const [championships, setChampionships] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadChampionships = async () => {
      try {
        setLoading(true);
        const data = await fetchMyChampionships(); // <-- MODIFICA QUI
        setChampionships(data);
      } catch (error) {
        setErrorMessage('Impossibile caricare i campionati.');
      } finally {
        setLoading(false);
      }
    };
    loadChampionships();
  }, []);

  // Effetto per far scomparire il messaggio di benvenuto dopo 5 secondi
  useEffect(() => {
    if (welcomeMessage) {
      // Pulisce lo stato della location per non mostrarlo di nuovo al refresh
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        setWelcomeMessage(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [welcomeMessage]);

  const handleJoinChampionship = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!joinCode) {
      setErrorMessage('Inserisci un codice di partecipazione.');
      return;
    }
    setLoading(true);
    try {
      const joinResponse = await joinChampionship(joinCode);
      const { championship: joinedChampionship, status: joinStatus } = joinResponse;
      setShowJoinModal(false);
      setJoinCode('');
      const message = joinStatus === 'already_member'
        ? 'Sei già un membro di questo campionato.'
        : `Benvenuto nel campionato ${joinedChampionship.name}!`;
      navigate(`/championships/${joinedChampionship.id}/dashboard`, { replace: true, state: { welcomeMessage: message } });
    } catch (error) {
      setErrorMessage(error.message || 'Errore durante la partecipazione al campionato.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="central-box">
      <div className="championships-list">
        {welcomeMessage && <div className="welcome-notification">{welcomeMessage}</div>}
        <h2 className="title">I TUOI CAMPIONATI</h2>
        <div className="championships-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button className="button" onClick={() => navigate('/create-championship')}>
            <FontAwesomeIcon icon={faPlus} /> Crea Campionato
          </button>
          <button className="button" onClick={() => setShowJoinModal(true)}>
            <FontAwesomeIcon icon={faKey} /> Partecipa
          </button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Caricamento campionati...</p>
          </div>
        ) : (
          <>
            {championships.length === 0 && (
              <p className="no-championships-message">Nessun campionato trovato. Creane uno o partecipa!</p>
            )}
            <div className="championship-grid">
              {championships.map((champ) => (
                <div key={champ.id} className="championship-card card">
                  {user && user.id === champ.admin_id ? (
                    <span className="ownership-icon admin" title="Campionato creato da te">
                      <FontAwesomeIcon icon={faCrown} />
                    </span>
                  ) : (
                    <span className="ownership-icon participant" title="Partecipi a questo campionato">
                      <FontAwesomeIcon icon={faUserGroup} />
                    </span>
                  )}
                  <Link to={`/championships/${champ.id}/dashboard`} className="championship-link">
                    {champ.logo && (
                      <img
                        src={`${champ.logo.replace(/^app\//, '')}`}
                        alt={`Logo ${champ.name}`}
                        className="championship-logo-img"
                      />
                    )}
                    <h3>{champ.name}</h3>
                    <p>
                      Stato: <span className={`championship-status ${getStatusClass(champ.status)}`}>
                        {decodeStatus(champ.status)}
                      </span>
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <Modal
        show={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Partecipa al Campionato"
        icon={<FontAwesomeIcon icon={faKey} />}
        isEnhanced={true}
        actions={{
          onSubmit: handleJoinChampionship,
          buttons: (
            <>
              <button type="button" className="button cancel" onClick={() => setShowJoinModal(false)}>
                Annulla
              </button>
              <button type="submit" className="button save" disabled={loading}>
                {loading ? 'Verifica...' : 'Partecipa'}
              </button>
            </>
          ),
          errorMessage: errorMessage,
        }}
      >
        <div style={{ padding: '0 1rem' }}>
          <p>Inserisci il codice di partecipazione fornito dal creatore del campionato.</p>
          <div className="form-group">
            <label htmlFor="join-code">Codice:</label>
            <input
              type="text"
              id="join-code"
              className="input-field"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChampionshipListPage;