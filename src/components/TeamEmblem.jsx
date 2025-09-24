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
        // La dimensione dell'icona (70px) era riferita al DOM normale.
        // Se vogliamo che l'icona Font Awesome riempia l'area del foreignObject (p. es. 80x80), 
        // diamo un font-size leggermente inferiore. 
        // L'area centrale del foreignObject la impostiamo a 80x80 (da 60 a 140) per centrare.
        const iconFontSize = '65px'; // Valore ottimizzato per un foreignObject 80x80 nel viewBox 200x200
        
        const props = { 
            color: color3, 
            style: { 
                fontSize: iconFontSize,
                lineHeight: '1', // Evita spazio extra
            } 
        };
        
        switch (icon) {
            case "ball":
                return <FontAwesomeIcon icon={faFutbol} {...props} />;
            case "crown":
            // ... (altri casi)
            default:
                return null;
        }
    };

    return (
        <svg width={size} height={size} viewBox="0 0 200 200">
            <defs>
                <clipPath id={shapeId}>{renderShape(true)}</clipPath>
            </defs>
            {renderShape()}
            <g clipPath={`url(#${shapeId})`}>{renderPattern()}</g>
            
            {/* ForeignObject centrato: 
             * x: (200 - 80) / 2 = 60
             * y: (200 - 80) / 2 = 60 
             * width/height: 80 
             * Questo rende l'area centrale 80x80 pixel nel contesto 200x200. */}
            <foreignObject x="60" y="60" width="80" height="80" 
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'visible',
                    textAlign: 'center' // Assicura che il testo sia centrato
                }}
            >
                {renderIcon()}
            </foreignObject>
        </svg>
    );
};

export default TeamEmblem;
