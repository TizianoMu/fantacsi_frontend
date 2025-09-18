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
  isAdmin }) => {
  // Checks if the event date is in the past.
  const isEventOver = (date) => new Date(date) < new Date();
  const dailyEvents = events.filter(event =>
    new Date(event.date).getDate() === date.getDate() &&
    new Date(event.date).getMonth() === date.getMonth() &&
    new Date(event.date).getFullYear() === date.getFullYear()
  );
  return (
    <div
      className={`calendar-day ${!isAdmin ? 'non-admin' : ''}`}
      onClick={() => isAdmin && onDayClick(date)}
    >
      <div className="day-number">
        {viewMode === 'weekly' ? (
          <>
            {date.getDate()}
            <span className="day-name">{date.toLocaleDateString('it-IT', { weekday: 'short' })}</span>
          </>
        ) : date.getDate()}
      </div>
      <div className="day-events">
        {dailyEvents.map(event => (
          <div
            key={event.id}
            className="event-item" // Gli utenti possono sempre cliccare per vedere i dettagli
            onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}
          >
            {/* Su mobile, mostra le icone solo nella vista mensile per risparmiare spazio. */}
            {isMobile && viewMode === 'monthly' ? (
                <div className="event-icons">
                  {event.home_team === championshipDisplayName ? (
                    <FontAwesomeIcon icon={faHome} title={`${event.home_team} vs ${event.away_team}`} />
                  ) : (
                    <FontAwesomeIcon icon={faPlane} title={`${event.home_team} vs ${event.away_team}`} />
                  )}
                  <FontAwesomeIcon icon={faFutbol} title={`${event.home_team} vs ${event.away_team}`} />
                  {event.manager_id && (
                    <FontAwesomeIcon icon={faUserCheck} title="Partita delegata" style={{ color: 'white' }} />
                  )}
                </div>
            ) : (
              isEventOver(event.date) ? (
                event.home_team_goal !== null ? (
                    <span>{event.home_team} {event.home_team_goal} - {event.away_team_goal} {event.away_team} {event.manager_id && (
                      <FontAwesomeIcon icon={faUserCheck} title="Partita delegata" style={{ color: 'white' }} />
                    )}</span>
                ) : (
                      <span>Partita in corso: {event.home_team} vs {event.away_team} {event.manager_id && (
                        <FontAwesomeIcon icon={faUserCheck} title="Partita delegata" style={{ color: 'white' }} />
                      )}</span>
                )
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {event.home_team} vs {event.away_team}
                  {event.manager_id && (
                    <FontAwesomeIcon icon={faUserCheck} title="Partita delegata" style={{ color: 'white' }} />
                  )}
                </span>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Day;