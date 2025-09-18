import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol, faCrown, faStar, faFire, faBan } from "@fortawesome/free-solid-svg-icons";

const EmblemCreator = ({
    shape = 'shield',
    pattern = 'none',
    color1 = '#ef7821',
    color2 = '#eb9a26',
    color3 = '#ffffff',
    icon = 'none',
    onPropChange
}) => {
    const shapeId = "emblem-shape"; // id usato nel clipPath

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
        switch (pattern) {
            case "stripes": // righe orizzontali
                return (
                    <>
                        <line x1="0" y1="50" x2="200" y2="50" stroke={color2} strokeWidth="20" />
                        <line x1="0" y1="100" x2="200" y2="100" stroke={color2} strokeWidth="20" />
                        <line x1="0" y1="150" x2="200" y2="150" stroke={color2} strokeWidth="20" />
                    </>
                );
            case "verticalStripes": // righe verticali fitte
                return (
                    <>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <line
                                key={i}
                                x1={20 * i}
                                y1="0"
                                x2={20 * i}
                                y2="200"
                                stroke={color2}
                                strokeWidth="10"
                            />
                        ))}
                    </>
                );
            case "singleDiagonal": // una sola diagonale
                return (
                    <line
                        x1="0"
                        y1="200"
                        x2="200"
                        y2="0"
                        stroke={color2}
                        strokeWidth="20"
                    />
                );
            case "cross":
                return (
                    <>
                        <line x1="100" y1="0" x2="100" y2="200" stroke={color2} strokeWidth="20" />
                        <line x1="0" y1="100" x2="200" y2="100" stroke={color2} strokeWidth="20" />
                    </>
                );
            case "diagonal": // due diagonali incrociate
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
        // Per FontAwesome, non possiamo usare <path> ma dobbiamo usare il componente FontAwesomeIcon
        // Lo posizioniamo con un <foreignObject> per renderizzarlo sopra l'SVG.
        const props = { color: color3, fontSize: '70px' };
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
        <div className="emblem-container">
            {/* Controlli sinistra */}
            <div className="emblem-side">
                <div className="form-group">
                    <label>Forma</label>
                    <div className="shape-grid">
                        {[
                            {
                                id: "shield",
                                label: "Scudo",
                                render: () => (
                                    <path d="M15,2 L28,7 L25,25 L15,28 L5,25 L2,7 Z" fill="black" />
                                ),
                            },
                            {
                                id: "circle",
                                label: "Cerchio",
                                render: () => <circle cx="15" cy="15" r="12" fill="black" />,
                            },
                            {
                                id: "square",
                                label: "Quadrato",
                                render: () => <rect x="4" y="4" width="22" height="22" fill="black" />,
                            },
                            {
                                id: "triangle",
                                label: "Triangolo",
                                render: () => <polygon points="15,3 27,27 3,27" fill="black" />,
                            },
                            {
                                id: "diamond",
                                label: "Rombo",
                                render: () => <polygon points="15,2 28,15 15,28 2,15" fill="black" />,
                            },
                            {
                                id: "star",
                                label: "Stella",
                                render: () => (
                                    <polygon
                                        points="15,2 18,10 27,10 20,16 23,25 15,20 7,25 10,16 3,10 12,10"
                                        fill="black"
                                    />
                                ),
                            },
                        ].map((s) => (
                            <button
                                key={s.id}
                                type="button"
                                className={`shape-btn ${shape === s.id ? "selected" : ""}`}
                                onClick={() => onPropChange('shape', s.id)}
                                title={s.label}
                            >
                                <svg width="30" height="30" viewBox="0 0 30 30">{s.render()}</svg>
                            </button>
                        ))}
                    </div>
                </div>


                <div className="form-group">
                    <label>Motivo</label>
                    <div className="pattern-grid">
                        {[
                            { id: "none", label: "Nessuno", render: () => null },
                            {
                                id: "stripes", label: "Righe orizz.", render: () => (
                                    <>
                                        <line x1="0" y1="7" x2="30" y2="7" stroke="black" strokeWidth="2" />
                                        <line x1="0" y1="15" x2="30" y2="15" stroke="black" strokeWidth="2" />
                                        <line x1="0" y1="23" x2="30" y2="23" stroke="black" strokeWidth="2" />
                                    </>
                                )
                            },
                            {
                                id: "verticalStripes", label: "Righe vert.", render: () => (
                                    <>
                                        <line x1="7" y1="0" x2="7" y2="30" stroke="black" strokeWidth="2" />
                                        <line x1="15" y1="0" x2="15" y2="30" stroke="black" strokeWidth="2" />
                                        <line x1="23" y1="0" x2="23" y2="30" stroke="black" strokeWidth="2" />
                                    </>
                                )
                            },
                            {
                                id: "singleDiagonal", label: "Diagonale", render: () => (
                                    <line x1="0" y1="30" x2="30" y2="0" stroke="black" strokeWidth="2" />
                                )
                            },
                            {
                                id: "diagonal", label: "X", render: () => (
                                    <>
                                        <line x1="0" y1="0" x2="30" y2="30" stroke="black" strokeWidth="2" />
                                        <line x1="30" y1="0" x2="0" y2="30" stroke="black" strokeWidth="2" />
                                    </>
                                )
                            },
                            {
                                id: "cross", label: "Croce", render: () => (
                                    <>
                                        <line x1="15" y1="0" x2="15" y2="30" stroke="black" strokeWidth="2" />
                                        <line x1="0" y1="15" x2="30" y2="15" stroke="black" strokeWidth="2" />
                                    </>
                                )
                            },
                            {
                                id: "circles", label: "Cerchi", render: () => (
                                    <>
                                        <circle cx="15" cy="15" r="6" fill="none" stroke="black" strokeWidth="2" />
                                        <circle cx="15" cy="15" r="12" fill="none" stroke="black" strokeWidth="2" />
                                    </>
                                )
                            },
                        ].map((p) => (
                            <button
                                key={p.id}
                                type="button"   // 🔥 impedisce il submit del form
                                className={`pattern-btn ${pattern === p.id ? "selected" : ""}`}
                                onClick={() => onPropChange('pattern', p.id)}
                                title={p.label}
                            >
                                <svg width="30" height="30" viewBox="0 0 30 30">{p.render()}</svg>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Icona</label>
                    <div className="icon-grid">
                        {[
                            { id: "none", label: "Nessuna", faIcon: faBan },
                            { id: "ball", label: "Pallone", faIcon: faFutbol },
                            { id: "crown", label: "Corona", faIcon: faCrown },
                            { id: "star", label: "Stella", faIcon: faStar },
                            { id: "flame", label: "Fiamma", faIcon: faFire },
                        ].map((i) => (
                            <button
                                key={i.id}
                                type="button"
                                className={`icon-btn ${icon === i.id ? "selected" : ""}`}
                                onClick={() => onPropChange('icon', i.id)}
                                title={i.label}
                            >
                                <FontAwesomeIcon icon={i.faIcon} size="lg" />
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Anteprima */}
            <div className="emblem-preview">
                <svg width="200" height="200" viewBox="0 0 200 200">
                    {/* Definizione clipPath */}
                    <defs>
                        <clipPath id={shapeId}>{renderShape(true)}</clipPath>
                    </defs>

                    {/* Disegno forma principale */}
                    {renderShape()}

                    {/* Disegno motivo dentro la forma */}
                    <g clipPath={`url(#${shapeId})`}>{renderPattern()}</g>

                    {/* Disegno icona in primo piano usando foreignObject per renderizzare HTML/React sopra SVG */}
                    <foreignObject x="56" y="60" width="80" height="80" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
                        {renderIcon()}
                    </foreignObject>
                </svg>
            </div>

            {/* Controlli destra */}
            <div className="emblem-side color-pickers-container">
                <div className="form-group">
                    <label>Colore principale</label>
                    <input
                        style={{ padding: '0' }}
                        type="color"
                        className="input-field"
                        value={color1}
                        onChange={(e) => onPropChange('color1', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Colore secondario</label>
                    <input
                        style={{ padding: '0' }}
                        type="color"
                        className="input-field"
                        value={color2}
                        onChange={(e) => onPropChange('color2', e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Colore icona</label>
                    <input
                        style={{ padding: '0' }}
                        type="color"
                        className="input-field"
                        value={color3}
                        onChange={(e) => onPropChange('color3', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmblemCreator;
