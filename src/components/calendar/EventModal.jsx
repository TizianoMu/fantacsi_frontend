import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchChampionshipParticipants } from '../../api/championships'; // Assicurati di avere questa API
import { useAuth } from '../../auth/AuthContext'; // Importiamo useAuth per ottenere l'ID dell'admin
import { faHome, faPlane, faFutbol, faMapMarkerAlt, faClock, faTimes, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import MatchStatsManager from './MatchStatsManager'; // Importa il nuovo componente

const EventModal = ({
  onClose,
  onAdd,
  onUpdate,
  selectedDate,
  editingEvent,
  showNotification,
  onDeleteEvent,
  championshipId, // Aggiunto per caricare i partecipanti
  championshipDisplayName,
  isAdmin,
}) => {
  const { user } = useAuth(); // Otteniamo l'utente corrente (che è l'admin)
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);
  const [location, setLocation] = useState(editingEvent ? editingEvent.place : '');
  const [time, setTime] = useState(
    editingEvent
      ? new Date(editingEvent.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
      : ''
  );
  const [homeTeamGol, setHomeTeamGol] = useState(editingEvent ? editingEvent.home_team_goal : '');
  const [awayTeamGol, setAwayTeamGol] = useState(editingEvent ? editingEvent.away_team_goal : '');
  const [matchManagerId, setMatchManagerId] = useState(editingEvent ? editingEvent.manager_id : null);
  const [participants, setParticipants] = useState([]);
  const [showStatsManager, setShowStatsManager] = useState(false); // Stato per mostrare il gestore delle statistiche

  // Carica i partecipanti del campionato per la dropdown del manager
  useEffect(() => {
    if (isAdmin) {
      const loadParticipants = async () => {
        try {
          const participantsData = await fetchChampionshipParticipants(championshipId);
          setParticipants(participantsData);
        } catch (error) {
          console.error("Errore nel caricamento dei partecipanti:", error);
        }
      };
      loadParticipants();
    }
  }, [championshipId, isAdmin]);

  useEffect(() => {
    if (editingEvent) {
      if (editingEvent.home_team === championshipDisplayName) {
        setIsSwapped(false);
        setHomeTeam(championshipDisplayName);
        setAwayTeam(editingEvent.away_team);
      } else {
        setIsSwapped(true);
        setHomeTeam(editingEvent.home_team);
        setAwayTeam(championshipDisplayName);
      }
      setMatchManagerId(editingEvent.manager_id);
    } else {
      setHomeTeam(championshipDisplayName);
      setAwayTeam('');
      setIsSwapped(false);
    }
  }, [championshipDisplayName, editingEvent]);

  const isEventOver = (date) => new Date(date) < new Date();
  const isFinished = isEventOver(selectedDate);
  const showGolFields = isFinished;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalHomeTeam = isSwapped ? homeTeam : championshipDisplayName;
    const finalAwayTeam = isSwapped ? championshipDisplayName : awayTeam;

    if (!finalHomeTeam || !finalAwayTeam || !location || !time) {
      showNotification('Per favore, compila tutti i campi.');
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const eventDate = new Date(selectedDate);
    eventDate.setHours(hours, minutes);

    const timezoneOffset = eventDate.getTimezoneOffset() * 60000;
    const localDate = new Date(eventDate.getTime() - timezoneOffset).toISOString().slice(0, -1);
    const eventData = {
      date: localDate,
      home_team: finalHomeTeam,
      away_team: finalAwayTeam,
      place: location,
      home_team_goal: showGolFields && homeTeamGol !== '' ? homeTeamGol : null,
      away_team_goal: showGolFields && awayTeamGol !== '' ? awayTeamGol : null,
      manager_id: matchManagerId, // Includi l'ID del manager
    };

    if (editingEvent) {
      onUpdate(editingEvent.id, eventData);
    } else {
      onAdd(eventData);
    }
  };

  const handleDragStart = (e, teamType) => {
    e.dataTransfer.setData('text/plain', teamType);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetTeam) => {
    e.preventDefault();
    const droppedItem = e.dataTransfer.getData('text/plain');

    if (droppedItem === 'home' && targetTeam === 'away') {
      const currentAwayValue = awayTeam;
      setIsSwapped(true);
      setHomeTeam(currentAwayValue);
      setAwayTeam(championshipDisplayName);
    } else if (droppedItem === 'away' && targetTeam === 'home') {
      const currentHomeValue = homeTeam;
      setIsSwapped(false);
      setHomeTeam(championshipDisplayName);
      setAwayTeam(currentHomeValue);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSwap = () => {
    // Se non è swappato, il valore di awayTeam è l'avversario. Lo spostiamo in homeTeam.
    if (!isSwapped) {
      setHomeTeam(awayTeam);
    } else { // Se è swappato, il valore di homeTeam è l'avversario. Lo spostiamo in awayTeam.
      setAwayTeam(championshipDisplayName);
    }
    setIsSwapped(prev => !prev);
  };

  if (showStatsManager) {
    return <MatchStatsManager matchId={editingEvent.id} onClose={() => setShowStatsManager(false)} championshipId={championshipId} />;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content enhanced-modal">
        <div className="modal-header enhanced-modal-header">
          <h3>
            <FontAwesomeIcon icon={faFutbol} className="modal-header-icon" />
            {isAdmin ? (editingEvent ? 'Modifica Partita' : 'Aggiungi Partita') : 'Dettagli Partita'}
            <span className="modal-date">
              {new Date(selectedDate).toLocaleDateString()}
            </span>
          </h3>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form enhanced-modal-form">
          <div className="form-row">
            <div className="form-group team-group">
              <label>
                <FontAwesomeIcon icon={faHome} /> Casa
              </label>
              <input
                type="text"
                value={isSwapped ? homeTeam : championshipDisplayName}
                readOnly={!isSwapped || !isAdmin}
                draggable={!isSwapped && isAdmin}
                className={`input-field team-input${!isSwapped ? ' team-home' : ''}`}
                onDragStart={(e) => handleDragStart(e, 'home')}
                onDrop={(e) => handleDrop(e, 'home')}
                onDragOver={handleDragOver}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="Squadra di casa"
                disabled={!isAdmin}
              />
            </div>
            {isAdmin && (
              <div className="swap-teams-button-container">
                <button type="button" onClick={handleSwap} className="swap-teams-button" title="Inverti squadre"><FontAwesomeIcon icon={faSyncAlt} /></button>
              </div>
            )}
            <div className="form-group team-group">
              <label>
                <FontAwesomeIcon icon={faPlane} /> Trasferta
              </label>
              <input
                type="text"
                value={isSwapped ? championshipDisplayName : awayTeam}
                readOnly={isSwapped || !isAdmin}
                draggable={isSwapped && isAdmin}
                className={`input-field team-input${isSwapped ? ' team-away' : ''}`}
                onDragStart={(e) => handleDragStart(e, 'away')}
                onDrop={(e) => handleDrop(e, 'away')}
                onDragOver={handleDragOver}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="Squadra in trasferta"
                disabled={!isAdmin}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Luogo
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field"
                placeholder="Campo o città"
                disabled={!isAdmin}
              />
            </div>
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faClock} /> Orario
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="input-field"
                disabled={!isAdmin}
              />
            </div>
          </div>
          {showGolFields && (
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faFutbol} /> Gol Casa
                </label>
                <input
                  type="number"
                  value={homeTeamGol}
                  onChange={(e) => setHomeTeamGol(e.target.value)}
                  className="input-field"
                  min="0"
                  placeholder="Gol squadra di casa"
                  disabled={!isAdmin}
                />
              </div>
              <div className="form-group">
                <label>
                  <FontAwesomeIcon icon={faFutbol} /> Gol Trasferta
                </label>
                <input
                  type="number"
                  value={awayTeamGol}
                  onChange={(e) => setAwayTeamGol(e.target.value)}
                  className="input-field"
                  min="0"
                  placeholder="Gol squadra in trasferta"
                  disabled={!isAdmin}
                />
              </div>
            </div>
          )}
          {/* Sezione per delegare la partita, visibile solo all'admin */}
          {isAdmin && (
            <div className="form-row">
              <div className="form-group">
                <label>Delega Gestione Partita</label>
                <select
                  value={matchManagerId || ''}
                  onChange={(e) => setMatchManagerId(e.target.value ? parseInt(e.target.value) : null)}
                  className="input-field"
                  disabled={!isAdmin}
                >
                  <option value="">Nessun delegato (gestisce l'admin)</option>
                  {participants.filter(p => p.user.id !== user.id).map(p => (
                    <option key={p.user.id} value={p.user.id}>
                      {p.user.username}
                    </option>
                  ))}
                </select>
                <small>Seleziona un utente a cui delegare l'inserimento del risultato e dei voti di questa partita.</small>
              </div>
            </div>
          )}

          <div className="modal-actions enhanced-modal-actions">
            {isAdmin ? (
              <>
                <button type="button" onClick={onClose} className="button cancel">Annulla</button>
                <button type="submit" className="button save">
                  {editingEvent ? 'Aggiorna Evento' : 'Salva Evento'}
                </button>
                {(!isFinished && editingEvent) && (
                  <button
                    type="button"
                    className="button delete"
                    onClick={() => editingEvent && onDeleteEvent(editingEvent.id)}
                  >
                    Elimina Evento
                  </button>
                )}
                {/* Pulsante per gestire i voti, visibile solo se l'evento è finito e si sta modificando */}
                {isFinished && editingEvent && (
                  <button type="button" className="button stats-manager" onClick={() => setShowStatsManager(true)}>
                    Gestisci Voti
                  </button>
                )}
              </>
            ) : (
              <button type="button" onClick={onClose} className="button cancel">
                Chiudi
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;