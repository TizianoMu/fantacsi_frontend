import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlane, faFutbol, faUserCheck } from '@fortawesome/free-solid-svg-icons';

// Component to render a single day cell.
const Day = ({
  date,
  events,
  onDayClick,
  onEditEvent,
  isMobile,
  viewMode,
  championshipDisplayName,
  isAdmin,
  isOutsideMonth,
  isToday
}) => {
  // Checks if the event date is in the past.
  const isEventOver = (eventDate) => new Date(eventDate) < new Date();
  const dailyEvents = events.filter(event =>
    new Date(event.date).toDateString() === date.toDateString()
  );

  const dayClass = [
    'calendar-day',
    isAdmin ? '' : 'non-admin',
    isOutsideMonth ? 'outside-month' : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={dayClass}
      onClick={() => isAdmin && onDayClick(date)}
      role="button"
      tabIndex={isAdmin && !isOutsideMonth ? 0 : -1}
      aria-label={`Giorno ${date.getDate()}`}
    >
      <div className={`day-number ${isOutsideMonth ? 'outside-month' : ''}`}>
        {isMobile && viewMode === 'weekly' && (
          <span className="day-name">{date.toLocaleDateString('it-IT', { weekday: 'short' })}</span>
        )}
        <span className={isToday ? 'today' : ''}>{date.getDate()}</span>
      </div>
      <div className="day-events">
        {dailyEvents.map(event => {
          const eventClasses = [
            'event-item',
            isEventOver(event.date) ? 'past-event' : '',
            isMobile ? 'marquee' : '' // Aggiunge la classe per l'effetto marquee su mobile
          ].filter(Boolean).join(' ');

          return (
            <div key={event.id} className={eventClasses} onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}>
              {/* Mostra le icone su mobile per risparmiare spazio */}
              <span className="event-icons">
                  {event.home_team === championshipDisplayName ? <FontAwesomeIcon icon={faHome} /> : <FontAwesomeIcon icon={faPlane} />}
                  <FontAwesomeIcon icon={faFutbol} />
                  {event.manager_id && <FontAwesomeIcon icon={faUserCheck} style={{ color: 'white' }} />}
              </span>
              {/* Mostra il testo su desktop */}
              <span className="event-text">
                {isEventOver(event.date) && event.home_team_goal !== null ? `${event.home_team} ${event.home_team_goal} - ${event.away_team_goal} ${event.away_team}` : `${event.home_team} vs ${event.away_team}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Day;
