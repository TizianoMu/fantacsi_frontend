// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlus, faUserGroup, faUserPlus, faPlusCircle, faFutbol, faMapMarkerAlt, faClock, faTshirt, faPlay, faLockOpen, faFlagCheckered, faTrophy, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { getToken, decodeToken } from '../utils/auth';
import { fetchDashboardData, updateChampionshipStatus } from '../api/championships';
import { saveFormation } from '../api/formations';
import InviteOptions from '../components/InviteOptions'; // Importiamo il nuovo componente
import SetFormationPage from './SetFormationPage'; // Lo importiamo per usarlo nel modal
import TeamEmblem from '../components/TeamEmblem';
import BackButton from '../components/BackButton';
import { decodeStatus, getStatusClass } from '../utils/status';

const DashboardPage = () => {
  const { championshipId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [championshipDetails, setChampionshipDetails] = useState(null);
  const [isChampionshipOwner, setIsChampionshipOwner] = useState(false);
  const [userHasTeam, setUserHasTeam] = useState(false);
  const [nextMatch, setNextMatch] = useState(null);
  const [allMatches, setAllMatches] = useState([]);
  const [isFormationDeadlinePassed, setIsFormationDeadlinePassed] = useState(false);
  const [showFormationModal, setShowFormationModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false); // Stato per il modale di invito
  const formationPageRef = useRef();
  const [modalContext, setModalContext] = useState({ matchId: null, isPast: false });
  const [welcomeMessage, setWelcomeMessage] = useState(location.state?.welcomeMessage);
  const [visibleMatchIndex, setVisibleMatchIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Singola chiamata per tutti i dati della dashboard
        const dashboardData = await fetchDashboardData(championshipId);

        setAllMatches(dashboardData.all_matches || []);

        // Definiamo nextMatchIndex qui
        const nextMatchIndex = dashboardData.all_matches.findIndex(
          m => dashboardData.next_match && m.id === dashboardData.next_match.id
        );
        setVisibleMatchIndex(nextMatchIndex !== -1 ? nextMatchIndex : 0);
        
        setRanking(dashboardData.ranking);
        setChampionshipDetails(dashboardData.details);

        const token = getToken();
        const userDetails = decodeToken(token);

        const hasTeam = dashboardData.ranking.some(team => team.owner_id === userDetails.id);
        setUserHasTeam(hasTeam);

        if (hasTeam) {
          setNextMatch(dashboardData.next_match);
          if (dashboardData.next_match) {
            // Crea un oggetto Date con la data e ora esatte del match
            const matchDate = new Date(dashboardData.next_match.date);
            
            // Calcola la deadline sottraendo 60 minuti dalla data del match
            const deadline = new Date(matchDate.getTime() - 60 * 60 * 1000);
            
            // Aggiorna lo stato in base al confronto
            setIsFormationDeadlinePassed(new Date() >= deadline);
          }
        }

      } catch (err) {
        setError('Errore nel caricamento dei dati.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [championshipId]);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!championshipDetails) {
        return;
      }
      const token = getToken();
      if (!token) {
        navigate('/auth');
        return;
      }
      const userDetails = decodeToken(token);
      setIsChampionshipOwner(championshipDetails.admin_id === userDetails.id);
    };
    checkOwnership();
  }, [championshipDetails, navigate]);


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

  const handleAddPlayers = () => {
    navigate(`/championships/${championshipId}/add-players`);
  };

  const handleCreateTeam = () => {
    // Logica per creare una nuova squadra
    navigate(`/championships/${championshipId}/create-team`);
  };

  const handleSetFormation = (matchId, isPast = false) => {
    setShowFormationModal(true);
    setModalContext({ matchId, isPast });
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (formationPageRef.current) {
      formationPageRef.current.submit();
    }
  };

  const handleCopyFormation = async () => {
    if (formationPageRef.current && nextMatch) {
      const confirmMessage = `Vuoi copiare questa formazione e schierarla per la prossima partita: ${nextMatch.home_team} vs ${nextMatch.away_team}?`;
      if (window.confirm(confirmMessage)) {
        const { starters: rawStarters, reserves: rawReserves, module } = formationPageRef.current.getFormation();
        
        // Filtra i valori nulli dagli array prima di inviarli
        const starters = rawStarters.filter(id => id !== null);
        const reserves = rawReserves.filter(id => id !== null);

        try {
          await saveFormation(nextMatch.id, starters, reserves, module); // Ora inviamo i dati "puliti"
          alert("Formazione copiata e salvata con successo per la prossima partita!");
          setShowFormationModal(false);
        } catch (error) {
          alert(`Errore durante il salvataggio della formazione copiata: ${error.message}`);
        }
      }
    } else if (window.confirm("Vuoi copiare questa formazione e schierarla per la prossima partita?")) { alert("Impossibile copiare la formazione: non c'è una prossima partita disponibile."); }
  };

  const handleUpdateStatus = async (newStatus, confirmMessage) => {
    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true);
        const updatedChampionship = await updateChampionshipStatus(championshipId, newStatus);
        setChampionshipDetails(updatedChampionship);
      } catch (err) {
        setError(`Errore nell'aggiornamento dello stato: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Determina se il mercato è aperto basandosi sullo stato
  const isMarketOpen = championshipDetails?.status === '20';
  // Determina se il campionato è terminato
  const isChampionshipFinished = championshipDetails?.status === '100';

  return (
    <div className="central-box">
      {welcomeMessage && <div className="welcome-notification">{welcomeMessage}</div>}
      <div className="dashboard-info">
      <BackButton />
      <div className="dashboard-header">
        <div className="status-container">
          <span className={`championship-status ${getStatusClass(championshipDetails?.status)}`}>
            {decodeStatus(championshipDetails?.status)}
          </span>
          {isChampionshipOwner && !isChampionshipFinished && (
            <div className="status-admin-actions">
              {isMarketOpen ? (
                <FontAwesomeIcon 
                  icon={faPlay} 
                  title="Avvia Campionato"
                  onClick={() => handleUpdateStatus('50', 'Sei sicuro di voler avviare il campionato? Le rose verranno bloccate.')} 
                />
              ) : (
                <FontAwesomeIcon 
                  icon={faLockOpen} 
                  title="Apri Mercato"
                  onClick={() => handleUpdateStatus('20', 'Sei sicuro di voler riaprire il mercato? Le rose saranno di nuovo modificabili.')} 
                />
              )}
              <FontAwesomeIcon 
                icon={faFlagCheckered} 
                title="Termina Campionato"
                onClick={() => handleUpdateStatus('100', 'Sei sicuro di voler terminare il campionato? Questa azione è irreversibile.')}
              />
            </div>
          )}
        </div>
        
        <h2 className="title">
          CLASSIFICA <FontAwesomeIcon icon={faUserGroup} />
          {isChampionshipOwner && (
            <FontAwesomeIcon
              className="add-players-icon"
              icon={faPlus}
              title="Aggiungi giocatori al campionato"
              onClick={handleAddPlayers}
            />
          )}
        </h2>
        <h3 className="subtitle">{championshipDetails?.name}</h3>
      </div>

      <div className="championships-actions dashboard-actions">
        <button className="button" onClick={() => navigate(`/championships/${championshipId}/calendar`)}>
          <FontAwesomeIcon icon={faCalendarAlt} /> Visualizza calendario
        </button>
        {!loading && !isChampionshipFinished && (
          <button className="button" onClick={handleCreateTeam} disabled={!isMarketOpen && userHasTeam}>
              <FontAwesomeIcon icon={userHasTeam ? faUserGroup : faPlusCircle} /> 
              {userHasTeam ? 'Modifica la tua squadra' : 'Crea la tua squadra'}
              {!isMarketOpen && userHasTeam && " (Mercato Chiuso)"}
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Caricamento classifica...</p>
        </div>
      ) : (
        <>
          {(!loading && ranking.length === 0) ? (
            <p className="no-championships-message">Nessuna squadra trovata in questo campionato.</p>
          ) : (
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th></th>
                  <th></th>
                  <th>SQUADRA</th>
                  <th>PUNTI</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ isChampionshipFinished ? ( index===0 ? <FontAwesomeIcon icon={faTrophy} style={{ color: '#edcc0dff' }} title="Campione" /> : null ) : null }</td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                      {(entry.logo_shape && entry.logo_color1 && entry.logo_color2) ? (
                        <TeamEmblem
                          shape={entry.logo_shape}
                          pattern={entry.logo_pattern}
                          icon={entry.logo_icon || ''}
                          color1={entry.logo_color1}
                          color2={entry.logo_color2}
                          color3={entry.logo_color3 || ''}
                          size={30}
                        />
                      ) : null}
                    </td>
                    <td>
                      <span>{entry.team_name}</span>
                    </td>
                    <td>{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      {!loading && userHasTeam && !isChampionshipFinished && allMatches.length > 0 && (
        <div className="match-carousel-container">
          <div className="match-carousel-viewport">
            <div className="match-carousel-track" style={{ transform: `translateX(-${visibleMatchIndex * 100}%)` }}>
              {allMatches.map((match, index) => {
                const isPastMatch = new Date(match.date) < new Date();
                return (
                  <div key={match.id} className={`match-card ${index === visibleMatchIndex ? 'active' : ''}`}>
                    <div className='next-match-content'>
                      <div className="subtitle next-match-title">
                        {visibleMatchIndex > 0 && (
                          <button className="chevron-btn back-button inline-button" onClick={() => setVisibleMatchIndex(i => i - 1)}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                          </button>
                        )}
                        <span>{isPastMatch ? "Partita giocata" : "Prossima partita"}</span>
                        {visibleMatchIndex < allMatches.length - 1 && (
                          <button className="chevron-btn next-button inline-button" onClick={() => setVisibleMatchIndex(i => i + 1)}>
                            <FontAwesomeIcon icon={faChevronLeft} rotation={180} />
                          </button>
                        )}
                      </div>
                      <div className="match-details">
                        <div className="match-teams">
                          <span className="team-name">{match.home_team}</span>
                          <span className="vs-separator">vs</span>
                          <span className="team-name">{match.away_team}</span>
                        </div>
                        {isPastMatch && (
                          <div className="match-teams">
                            <span className="team-name">{match.home_team_goal}</span>
                            <span className="vs-separator">-</span>
                            <span className="team-name">{match.away_team_goal}</span>
                          </div>
                        )}
                        <div className="match-info">
                          <p><FontAwesomeIcon icon={faClock} /> {new Date(match.date).toLocaleString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                          <p><FontAwesomeIcon icon={faMapMarkerAlt} /> {match.place}</p>
                        </div>
                      </div>
                      <button className="button formation-button" onClick={() => handleSetFormation(match.id, isPastMatch)}>
                        {isPastMatch ? "Visualizza Formazione" : "Schiera Formazione"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
        {isChampionshipFinished && (
          <div className="championship-finished">
            <h3 className="subtitle">Campionato Terminato</h3>
            <p>Il campionato è terminato. Grazie per aver partecipato!</p>
          </div>
        )}
        {!isChampionshipFinished && (
          <div className="dashboard-invite">
            <button className="button" onClick={() => setShowInviteModal(true)}>
              <FontAwesomeIcon icon={faUserPlus} /> Invita nuovi partecipanti
            </button>
          </div>
        )}
        {showFormationModal && modalContext.matchId && (
          <Modal
            show={showFormationModal}
            onClose={() => setShowFormationModal(false)}
            title={
              <>
                <span className="hide-on-mobile">{modalContext.isPast ? "Visualizza Formazione" : "Schiera Formazione"}</span>
                <span className={`formation-title budget-value`}>
                  <span>{allMatches.find(m => m.id === modalContext.matchId)?.home_team} vs {allMatches.find(m => m.id === modalContext.matchId)?.away_team}</span>
                </span>
              </>
            }
            icon={<FontAwesomeIcon icon={faTshirt} />}
            isEnhanced={true}
            actions={{
              onSubmit: modalContext.isPast ? (e) => e.preventDefault() : handleModalSubmit,
              buttons: (
                <>
                  <button type="button" className="button cancel" onClick={() => { setShowFormationModal(false) }}>
                    Chiudi
                  </button>
                  {modalContext.isPast && nextMatch && (
                    <button type="button" className="button" onClick={handleCopyFormation}>
                      Copia per prossima partita
                    </button>
                  )}
                  {!modalContext.isPast && (
                    <button type="submit" className="button save">
                      Salva Formazione
                    </button>
                  )}
                </>
              ),
            }}
          >
            <SetFormationPage
              ref={formationPageRef}
              matchId={modalContext.matchId}
              championshipId={championshipId}
              onFormationSaved={() => setShowFormationModal(false)}
              isModal={true}
              isPastMatch={modalContext.isPast}
            />
          </Modal>
        )}
        {showInviteModal && (
          <Modal
            show={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            title="Invita Partecipanti"
            icon={<FontAwesomeIcon icon={faUserPlus} />}
            isEnhanced={true}
          // Non servono actions se i pulsanti sono dentro il componente
          >
            <div style={{ padding: '0 1rem 1rem 1rem' }}>
              <InviteOptions championshipDetails={championshipDetails} />
            </div>
          </Modal>
        )}
    </div>
    </div>
  );
};

export default DashboardPage;
