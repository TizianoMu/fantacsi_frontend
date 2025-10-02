import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlane, faFutbol, faUserCheck } from '@fortawesome/free-solid-svg-icons';

const EventItem = ({ event, onEditEvent, championshipDisplayName }) => {
    const textRef = useRef(null);
    const containerRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const isEventOver = (eventDate) => new Date(eventDate) < new Date();

    useEffect(() => {
        const checkOverflow = () => {
            const container = containerRef.current;
            const text = textRef.current;
            if (container && text) {
                // Usiamo requestAnimationFrame per assicurarci che il browser abbia renderizzato
                // il layout prima di misurare. Questo ci dà una clientWidth affidabile.
                requestAnimationFrame(() => {
                    const hasOverflow = text.scrollWidth > container.clientWidth;
                    // Aggiorniamo lo stato solo se è cambiato per evitare re-render inutili.
                    setIsOverflowing(current => current !== hasOverflow ? hasOverflow : current);
                });
            }
        };

        // Controlla al mount e quando l'evento cambia
        checkOverflow();

        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [event]); // Rimuoviamo 'isOverflowing' per evitare loop infiniti

    const eventClasses = [
        'event-item',
        isEventOver(event.date) ? 'past-event' : '',
        isOverflowing ? 'marquee' : '' // Applica la classe marquee solo se necessario
    ].filter(Boolean).join(' ');

    return (
        <div ref={containerRef} className={eventClasses} onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}>
            <span className="event-icons">
                {event.home_team === championshipDisplayName ? <FontAwesomeIcon icon={faHome} /> : <FontAwesomeIcon icon={faPlane} />}
                <FontAwesomeIcon icon={faFutbol} />
                {event.manager_id && <FontAwesomeIcon icon={faUserCheck} style={{ color: 'white' }} />}
            </span>
            <span ref={textRef} className="event-text">
                {isEventOver(event.date) && event.home_team_goal !== null
                    ? `${event.home_team} ${event.home_team_goal} - ${event.away_team_goal} ${event.away_team}`
                    : `${event.home_team} vs ${event.away_team}`}
            </span>
        </div>
    );
};

export default EventItem;