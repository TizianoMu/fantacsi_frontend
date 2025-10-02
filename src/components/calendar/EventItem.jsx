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
                const hasOverflow = text.scrollWidth > container.clientWidth;
                if (hasOverflow !== isOverflowing) {
                    setIsOverflowing(hasOverflow);
                }
            }
        };

        // Controlla al mount e ogni volta che l'evento cambia
        checkOverflow();

        // Aggiungi un listener per il resize della finestra
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [event, isOverflowing]); // riesegui se l'evento cambia

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
