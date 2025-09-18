import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Notification from '../components/calendar/Notification';
import Day from '../components/calendar/Day';
import EventModal from '../components/calendar/EventModal';
import { fetchMatchesDetails, fetchAddMatch, fetchUpdateMatch, fetchDeleteMatch } from '../api/matches';
import { fetchChampionshipDetails } from '../api/championships';
import { useIsMobile } from '../utils/hooks';
import { getToken, decodeToken } from '../utils/auth';
import BackButton from '../components/BackButton';

// Define the main App component that contains the calendar and all its logic.
const CalendarPage = () => {
  const isMobile = useIsMobile();
  // State to store all events fetched from Firestore
  const [events, setEvents] = useState([]);
  // State to manage the modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to store the date selected by the user for adding an event
  const [selectedDate, setSelectedDate] = useState(null);
  // State to manage the loading status and user info
  const [isLoading, setIsLoading] = useState(true);
  // State for the calendar's current view
  const [currentDate, setCurrentDate] = useState(new Date());
  // State to manage the current view mode (monthly or weekly)
  const [viewMode, setViewMode] = useState(isMobile ? 'weekly' : 'monthly');
  // State for the event being edited
  const [editingEvent, setEditingEvent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // Nuovo stato per i permessi
  const [championshipDetails, setChampionshipDetails] = useState(null);

  // States for the custom notification system.
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { championshipId } = useParams();
  const [championshipName, setChampionshipName] = useState('');
  // Function to show a temporary notification message.
  const showTemporaryNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    // Hide the notification after 3 seconds.
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
    }, 3000);
  };

  useEffect(() => {
    const checkPermissionsAndLoadData = async () => {
      try {
        setIsLoading(true);

        // 1. Recupera l'utente corrente
        const token = getToken();
        const userDetails = decodeToken(token);

        // 2. Carica partite e dettagli del campionato in una sola chiamata
        const data = await fetchMatchesDetails(championshipId);
        setChampionshipDetails(data.championship);
        setEvents(data.matches);

        // 3. Controlla se l'utente è l'admin
        if (userDetails && data.championship) {
          setIsAdmin(userDetails.id === data.championship.admin_id);
        }
      } catch (error) {
        console.error("Errore nel caricamento dei dati del calendario:", error);
        showTemporaryNotification("Impossibile caricare i dati del calendario.");
      } finally {
        setIsLoading(false);
      }
    };
    checkPermissionsAndLoadData();
  }, [championshipId]);

  // Generates an array of dates for the current month.
  const getDaysInMonth = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }
    return days;
  };

  // Generates an array of dates for the current week.
  const getDaysInWeek = (date) => {
    const dayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.
    // Adjust to make Monday the first day of the week
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - diff);
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i));
    }
    return days;
  };

  // Handles moving to the next month or week.
  const handleNext = () => {
    if (viewMode === 'monthly') {
      setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() + 7));
    }
  };

  // Handles moving to the previous month or week.
  const handlePrev = () => {
    if (viewMode === 'monthly') {
      setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate() - 7));
    }
  };

  // Handles switching the view mode.
  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  // Opens the modal when a day is clicked and sets the selected date.
  const handleDayClick = (date) => {
    if (!isAdmin) return; // Solo l'admin può aggiungere eventi
    setSelectedDate(date);
    setEditingEvent(null); // Clear any event being edited
    setIsModalOpen(true);
  };

  // Handles editing an event.
  const handleEditClick = (event) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setIsModalOpen(true);
  };

  // Closes the modal and resets the selected date.
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setEditingEvent(null);
  };

  // Adds a new event to the state (simulating a DB save).
  const handleAddEvent = async (eventData) => {
    const response = await fetchAddMatch(championshipId, eventData);
    if (!response.ok) {
      console.error('Errore durante il salvataggio della partita:', response.statusText);
      return;
    }
    const data = await response.json();
    setEvents(prevEvents => [...prevEvents, data]);
    handleCloseModal();
    showTemporaryNotification("Evento salvato con successo!");
  };

  // Updates an existing event in the state (simulating a DB update).
  const handleUpdateEvent = async (eventId, eventData) => {
    const response = await fetchUpdateMatch(eventId, eventData);
    if (!response.ok) {
      console.error('Errore durante il salvataggio della partita:', response.statusText);
      return;
    }
    const data = await response.json();
    // Aggiorna lo stato `events` trovando l'evento con l'ID corrispondente e sostituendolo.
    setEvents(prevEvents => prevEvents.map(event =>
      event.id === eventId ? { ...event, ...data } : event
    ));
    handleCloseModal();
    showTemporaryNotification("Evento aggiornato con successo!");
  };

  // Deletes an event from the state (simulating a DB delete).
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo evento?")) {
      return;
    }
    const response = await fetchDeleteMatch(eventId);
    if (!response.ok) {
      console.error('Errore durante l\'eliminazione della partita:', response.statusText);
      return;
    }
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    setIsModalOpen(false);
    showTemporaryNotification("Evento cancellato.");
  };

  // Render the calendar and modal.
  const daysToRender = viewMode === 'monthly' ? getDaysInMonth(currentDate) : getDaysInWeek(currentDate);

  return (
    <div className="central-box">
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Caricamento eventi...</p>
        </div>
      ) : (
        <div className="calendar-card">
            <BackButton/>
            <div className='calendar-info'>
              <h2 className="title">{championshipDetails?.name}</h2>
            </div>
          <div className="calendar-controls">
            <button
              onClick={handlePrev}
              className="nav-button"
              aria-label="Precedente"
            >
              &#x2039;
            </button>
            <div className="view-and-title">
              <h2 className="title calendar-title">
                {viewMode === 'monthly'
                  ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                  : isMobile
                    ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                    : 'Settimana dal ' + currentDate.toLocaleDateString('default', { day: '2-digit', month: 'short' }) + ' al ' + new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 6).toLocaleDateString('default', { day: '2-digit', month: 'short' })
                }
              </h2>
              <div className="view-buttons">
                <button onClick={() => handleViewChange('weekly')} className={`view-button${viewMode === 'weekly' ? ' active' : ''}`}>Settimana</button>
                <button onClick={() => handleViewChange('monthly')} className={`view-button${viewMode === 'monthly' ? ' active' : ''}`}>Mese</button>
              </div>
            </div>
            <button
              onClick={handleNext}
              className="nav-button"
              aria-label="Successivo"
            >
              &#x203A;
            </button>
          </div>
          {/* La griglia del calendario, che si adatta alla vista settimanale/mensile e mobile/desktop */}
          <div className={`calendar-grid ${isMobile && viewMode === 'weekly' ? 'mobile-weekly-view' : ''}`}>
            {/* L'intestazione con i giorni della settimana viene mostrata solo se non siamo in vista settimanale su mobile */}
            {!(isMobile && viewMode === 'weekly') && (
              <div className="grid-header">
                {viewMode === 'weekly' ? (
                  <>
                    <div>Lun</div><div>Mar</div><div>Mer</div><div>Gio</div><div>Ven</div><div>Sab</div><div>Dom</div>
                  </>
                ) : (
                  <>
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                  </>
                )}
              </div>
            )}
            <div className={`day-cells ${viewMode === 'weekly' ? 'weekly' : ''}`}>
              {daysToRender.map(date => (
                <Day
                  key={date.toISOString()}
                  date={date}
                  events={events}
                  onDayClick={handleDayClick}
                  onEditEvent={handleEditClick}
                  isMobile={isMobile}
                  viewMode={viewMode}
                  championshipDisplayName={championshipDetails?.alias || championshipDetails?.name}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <EventModal
          onClose={handleCloseModal}
          onAdd={handleAddEvent}
          onUpdate={handleUpdateEvent}
          selectedDate={selectedDate}
          editingEvent={editingEvent}
          showNotification={showTemporaryNotification}
          onDeleteEvent={handleDeleteEvent}
          championshipId={championshipId}
          championshipDisplayName={championshipDetails?.alias || championshipDetails?.name}
          isAdmin={isAdmin}
        />
      )}

      <Notification message={notificationMessage} show={showNotification} />
    </div>
  );
};

export default CalendarPage;