import React from 'react';
import EventItem from './EventItem';

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
          return (
            <EventItem
              key={event.id}
              event={event}
              onEditEvent={onEditEvent}
              championshipDisplayName={championshipDisplayName}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Day;
