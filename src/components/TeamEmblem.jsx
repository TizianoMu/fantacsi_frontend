import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol, faCrown, faStar, faFire } from "@fortawesome/free-solid-svg-icons";

const TeamEmblem = ({ shape, pattern, color1, color2, color3, icon, size = 40 }) => {
    // Genera un ID univoco per il clipPath
    const shapeId = `emblem-shape-${Math.random().toString(36).substr(2, 9)}`;

    const renderShape = (isClip = false) => {
        const props = isClip
            ? { fill: "white", stroke: "none" }
            : { fill: color1, stroke: color2, strokeWidth: "10" };

        switch (shape) {
            case "circle":
                return <circle cx="100" cy="100" r="90" {...props} />;
            case "square":
                return <rect x="20" y="20" width="160" height="160" {...props} />;
            case "triangle":
                return <polygon points="100,20 180,180 20,180" {...props} />;
            case "diamond":
                return <polygon points="100,10 190,100 100,190 10,100" {...props} />;
            case "star":
                return (
                    <polygon
                        points="100,10 120,70 180,70 130,110 150,170 100,135 50,170 70,110 20,70 80,70"
                        {...props}
                    />
                );
            case "shield":
            default:
                return (
                    <path
                        d="M100,10 L180,50 L160,170 L100,190 L40,170 L20,50 Z"
                        {...props}
                    />
                );
        }
    };

    const renderPattern = () => {
        // Logica per i pattern (omessa per brevità, resta invariata)
        switch (pattern) {
            case "stripes":
                return (
                    <>
                        <line x1="0" y1="50" x2="200" y2="50" stroke={color2} strokeWidth="20" />
                        <line x1="0" y1="100" x2="200" y2="100" stroke={color2} strokeWidth="20" />
                        <line x1="0" y1="150" x2="200" y2="150" stroke={color2} strokeWidth="20" />
                    </>
                );
            case "verticalStripes":
                return (
                    <>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <line key={i} x1={20 * i} y1="0" x2={20 * i} y2="200" stroke={color2} strokeWidth="10" />
                        ))}
                    </>
                );
            case "singleDiagonal":
                return <line x1="0" y1="200" x2="200" y2="0" stroke={color2} strokeWidth="20" />;
            case "cross":
                return (
                    <>
                        <line x1="100" y1="0" x2="100" y2="200" stroke={color2} strokeWidth="20" />
                        <line x1="0" y1="100" x2="200" y2="100" stroke={color2} strokeWidth="20" />
                    </>
                );
            case "diagonal":
                return (
                    <>
                        <line x1="0" y1="0" x2="200" y2="200" stroke={color2} strokeWidth="20" />
                        <line x1="200" y1="0" x2="0" y2="200" stroke={color2} strokeWidth="20" />
                    </>
                );
            case "circles":
                return (
                    <>
                        <circle cx="100" cy="100" r="40" fill="none" stroke={color2} strokeWidth="6" />
                        <circle cx="100" cy="100" r="70" fill="none" stroke={color2} strokeWidth="6" />
                    </>
                );
            default:
                return null;
        }
    };

    const renderIcon = () => {
        // Calcola la dimensione dell'icona (circa 80% della dimensione totale dell'emblema)
        const iconFontSize = `${size * 0.8}px`; 
        const props = { color: color3, style: { fontSize: iconFontSize } };
        
        switch (icon) {
            case "ball":
                return <FontAwesomeIcon icon={faFutbol} {...props} />;
            case "crown":
                return <FontAwesomeIcon icon={faCrown} {...props} />;
            case "star":
                return <FontAwesomeIcon icon={faStar} {...props} />;
            case "flame":
                return <FontAwesomeIcon icon={faFire} {...props} />;
            default:
                return null;
        }
    };

    return (
        // Contenitore principale con dimensioni fisse (p. es. 30px x 30px) e posizionamento relativo
        <div style={{ width: size, height: size, position: 'relative' }}>
            {/* L'SVG è posizionato assolutamente per riempire il contenitore */}
            <svg width={size} height={size} viewBox="0 0 200 200" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                    <clipPath id={shapeId}>{renderShape(true)}</clipPath>
                </defs>
                {renderShape()}
                <g clipPath={`url(#${shapeId})`}>{renderPattern()}</g>
            </svg>

            {/* Icona di Font Awesome posizionata centralmente sopra l'SVG nel DOM normale */}
            {icon ? (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {renderIcon()}
                </div>
            ) : null}
        </div>
    );
};

export default TeamEmblem;
