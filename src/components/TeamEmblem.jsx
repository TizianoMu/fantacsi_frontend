import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol, faCrown, faStar, faFire } from "@fortawesome/free-solid-svg-icons";

const TeamEmblem = ({ shape, pattern, color1, color2, color3, icon, size = 40 }) => {
    const shapeId = `emblem-shape-${Math.random().toString(36).substr(2, 9)}`;

    // Funzione che disegna la forma, senza lo stroke per lo sfondo
    const renderShapeBase = (fillColor) => {
        const props = { fill: fillColor, stroke: "none" };

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
    
    // Funzione per disegnare solo il contorno
    const renderStroke = () => {
        const props = { 
            fill: "none", // Riempimento trasparente
            stroke: color2, 
            strokeWidth: "10" 
        };

        // Riutilizza la logica di renderShapeBase
        // N.B.: Devi adattare leggermente le dimensioni per alcune forme se lo stroke
        // esterno non è gestito da "stroke-outside" (non supportato in SVG base)
        switch (shape) {
            case "circle":
                return <circle cx="100" cy="100" r="95" {...props} />; // Leggermente più grande per compensare
            case "square":
                return <rect x="15" y="15" width="170" height="170" {...props} />;
            case "triangle":
                return <polygon points="100,10 190,190 10,190" {...props} />;
            case "diamond":
                return <polygon points="100,5 195,100 100,195 5,100" {...props} />;
            case "star":
                return (
                    <polygon
                        points="100,10 120,70 180,70 130,110 150,170 100,135 50,170 70,110 20,70 80,70"
                        {...props} // Qui lo stroke si adatta meglio alla forma esistente
                    />
                );
            case "shield":
            default:
                // Disegniamo due volte per garantire che il bordo sia esterno (questo è un hack SVG)
                return (
                    <path
                        d="M100,10 L180,50 L160,170 L100,190 L40,170 L20,50 Z"
                        {...props}
                    />
                );
        }
    }


    const renderPattern = () => {
        // La logica del pattern rimane invariata
        switch (pattern) {
            case "stripes":
                // ... (pattern)
            // Resto dei pattern invariato
            default:
                return null;
        }
    };

    const renderIcon = () => {
        const iconFontSize = '65px'; 
        const props = { 
            color: color3, 
            style: { 
                fontSize: iconFontSize,
                lineHeight: '1',
            } 
        };
        
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
        <svg width={size} height={size} viewBox="0 0 200 200">
            <defs>
                {/* 1. CLIPPED PATH: Usiamo la forma base come clip path per pattern e icone */}
                <clipPath id={shapeId}>{renderShapeBase("white")}</clipPath>
            </defs>
            
            {/* 2. LIVELLO BASE: Disegna la forma di sfondo (il colore1) */}
            {renderShapeBase(color1)}

            {/* 3. LIVELLO MEDIO: Pattern, clippato sulla forma */}
            <g clipPath={`url(#${shapeId})`}>{renderPattern()}</g>

            {/* 4. LIVELLO ALTO: Icona Font Awesome, anch'essa clippata */}
            <foreignObject x="60" y="60" width="80" height="80" 
                clipPath={`url(#${shapeId})`} /* Aggiungiamo il clipPath anche all'icona */
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    overflow: 'visible',
                    textAlign: 'center' 
                }}
            >
                {renderIcon()}
            </foreignObject>
            
            {/* 5. LIVELLO SUPERIORE: Disegna il contorno (stroke) per ultimo, sopra tutto */}
            {renderStroke()}
        </svg>
    );
};

export default TeamEmblem;
