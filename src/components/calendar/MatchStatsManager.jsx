import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClipboardList, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { fetchPlayersForChampionship } from '../../api/players';
import { fetchMatchStats, saveMatchStats, sendVotingClosedEmail } from '../../api/matches';
import Notification from './Notification';
import { useIsMobile } from '../../utils/hooks';

const statLabels = {
    goals: { short: 'G', full: 'Gol' },
    assists: { short: 'A', full: 'Assist' },
    penalties_saved: { short: 'RP', full: 'Rig. Parato' },
    yellow_cards: { short: 'Amm', full: 'Ammonizione' },
    red_card: { short: 'Esp', full: 'Espulsione' },
    own_goals: { short: 'AG', full: 'Autogol' },
    penalties_missed: { short: 'RS', full: 'Rig. Sbagliato' },
    goals_conceded: { short: 'GS', full: 'Gol Subito' }
};

const StatInput = ({ label, abbr, value, onIncrement, onDecrement, color }) => (
    <div className="stat-input-group stat-input-flex">
        <span className="stat-label stat-label-responsive">
            <span className="stat-label-full">{label}</span>
            <span className="stat-label-short">{abbr}</span>
        </span>
        <div className="stat-controls">
            <button
                type="button"
                onClick={onDecrement}
                className="button stat-btn"
                style={{ background: color }}
            >-</button>
            <span className="stat-value">{value}</span>
            <button
                type="button"
                onClick={onIncrement}
                className="button stat-btn"
                style={{ background: color }}
            >+</button>
        </div>
    </div>
);

const MatchStatsManager = ({ matchId, onClose, championshipId }) => {
    const [players, setPlayers] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState({ show: false, message: '' });
    const [openCards, setOpenCards] = useState({});
    const [votingClosed, setVotingClosed] = useState(false);
    const [voteInputs, setVoteInputs] = useState({});
    const [saving, setSaving] = useState(false);
    const isMobile = useIsMobile(700);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [playersData, statsData] = await Promise.all([
                    fetchPlayersForChampionship(championshipId),
                    fetchMatchStats(matchId)
                ]);
                setPlayers(playersData);

                const initialStats = playersData.reduce((acc, player) => {
                    const existingStat = statsData.find(s => s.real_player_id === player.id);
                    acc[player.id] = {
                        vote: existingStat?.vote ?? null,
                        goals: existingStat?.goals ?? 0,
                        assists: existingStat?.assists ?? 0,
                        yellow_cards: existingStat?.yellow_cards ?? 0,
                        red_card: existingStat?.red_card ?? 0,
                        penalties_saved: existingStat?.penalties_saved ?? 0,
                        penalties_missed: existingStat?.penalties_missed ?? 0,
                        own_goals: existingStat?.own_goals ?? 0,
                        goals_conceded: existingStat?.goals_conceded ?? 0,
                    };
                    return acc;
                }, {});
                setStats(initialStats);

            } catch (error) {
                console.error("Errore nel caricamento dei dati per le statistiche:", error);
                showAppNotification("Impossibile caricare i dati. Riprova più tardi.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
        // eslint-disable-next-line
    }, [matchId, championshipId]);

    const showAppNotification = (message, type = 'error') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'info' }), 3000);
    };

    const handleStatChange = (playerId, field, value) => {
        setStats(prev => ({
            ...prev,
            [playerId]: { ...prev[playerId], [field]: value }
        }));
    };

    const handleVoteChange = (playerId, value) => {
        if (value.toUpperCase() === 'S.V.' || value === '') {
            handleStatChange(playerId, 'vote', null);
        } else {
            const numericValue = parseFloat(value.replace(',', '.'));
            if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 10) {
                handleStatChange(playerId, 'vote', numericValue);
            }
        }
    };

    const handleIncrement = (playerId, field) => {
        const currentValue = stats[playerId][field];
        handleStatChange(playerId, field, currentValue + 1);
    };

    const handleDecrement = (playerId, field) => {
        const currentValue = stats[playerId][field];
        if (currentValue > 0) {
            handleStatChange(playerId, field, currentValue - 1);
        }
    };

    const handleSave = async () => {
        // Trova giocatori con bonus/malus ma senza voto
        const playersWithBonusNoVote = Object.entries(stats).filter(([_, s]) => {
            const hasBonusMalus =
                (s.goals || s.assists || s.penalties_saved || s.yellow_cards || s.red_card || s.own_goals || s.penalties_missed || s.goals_conceded);
            return hasBonusMalus && (s.vote === null || s.vote === undefined || s.vote === "");
        });

        if (playersWithBonusNoVote.length > 0) {
            const confirmMsg = `Attenzione: alcuni giocatori hanno bonus/malus ma non hanno voto. Vuoi continuare comunque?\n\n` +
                playersWithBonusNoVote.map(([id, s]) => {
                    const p = players.find(pl => pl.id === parseInt(id));
                    return p ? `${p.name}` : `ID ${id}`;
                }).join('\n');
            if (!window.confirm(confirmMsg)) return;
        }

        setSaving(true); // Disabilita il pulsante e mostra "Salvataggio in corso"

        const statsToSave = Object.entries(stats)
            .filter(([_, s]) => s.vote !== null && s.vote !== undefined && s.vote !== "")
            .map(([playerId, playerStats]) => ({
                match_id: matchId,
                real_player_id: parseInt(playerId),
                ...playerStats
            }));

        try {
            await saveMatchStats(matchId, statsToSave);

            if (votingClosed) {
                try {
                    await sendVotingClosedEmail(championshipId);
                    showAppNotification("Email inviate ai partecipanti.", 'success');
                } catch (err) {
                    showAppNotification("Errore nell'invio delle email.", 'error');
                }
            } else {
                showAppNotification("Statistiche salvate con successo!", 'success');
            }

            setTimeout(() => {
                setSaving(false);
                onClose();
            }, 1000);

        } catch (error) {
            setSaving(false);
            console.error("Errore nel salvataggio delle statistiche:", error);
            showAppNotification(error.message || "Errore durante il salvataggio.");
        }
    };

    const filteredPlayers = useMemo(() => {
        if (!searchTerm) return players;
        return players.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.number?.toString().includes(searchTerm)
        );
    }, [players, searchTerm]);

    const toggleCard = (playerId) => {
        setOpenCards(prev => ({
            ...prev,
            [playerId]: !prev[playerId]
        }));
    };

    if (loading) {
        return <div className="modal-overlay"><div className="modal-content">Caricamento...</div></div>;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content enhanced-modal stats-manager-modal">
                <Notification {...notification} />
                <div className="modal-header enhanced-modal-header">
                    <h3>
                        <FontAwesomeIcon icon={faClipboardList} className="modal-header-icon" />
                        {isMobile ? "Voti" : "Gestione Voti e Statistiche"}
                    </h3>
                    <button onClick={onClose} className="close-button"><FontAwesomeIcon icon={faTimes} /></button>
                </div>
                <div className="stats-manager-toolbar" style={{ marginBottom: 16 }}>
                    <input
                        type="text"
                        className="input-field search-input search-bar"
                        placeholder="Cerca per nome o numero..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ marginBottom: 16, marginLeft: isMobile ? 0 : 25 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 500 }}>
                        <input
                            type="checkbox"
                            checked={votingClosed}
                            onChange={e => setVotingClosed(e.target.checked)}
                            style={{ marginRight: 8 }}
                        />
                        Votazioni terminate (invia email ai partecipanti)
                    </label>
                </div>
                <div className="stats-manager-list">
                    {filteredPlayers.map(player => {
                        const isOpen = !!openCards[player.id];
                        return (
                            <div
                                key={player.id}
                                className="card player-vote-card"
                                style={{
                                    marginBottom: 18,
                                    background: '#fff8ec',
                                    border: '1px solid #eb9a26',
                                    transition: 'box-shadow 0.2s',
                                    boxShadow: isOpen ? '0 4px 16px rgba(239,120,33,0.10)' : 'none'
                                }}
                            >
                                <div
                                    className="player-info-section"
                                    style={{
                                        alignItems: 'center',
                                        marginBottom: isOpen ? 8 : 0,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}
                                    onClick={() => toggleCard(player.id)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <img src={player.photo_url} alt={player.name} className="player-photo-small" style={{ marginRight: 8 }} />
                                        <span className="player-name" style={{ fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                                            {player.number}. {player.name} ({player.role.charAt(0)})
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span className="bold-text" style={{ fontSize: '1.3rem', color: 'var(--secondary-color)' }}>
                                            {stats[player.id]?.vote === null || stats[player.id]?.vote === undefined
                                                ? 'S.V.'
                                                : String(stats[player.id]?.vote).replace('.', ',')}
                                        </span>
                                        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} style={{ color: 'var(--primary-color)', fontSize: 20 }} />
                                    </div>
                                </div>
                                {isOpen && (
                                    <div>
                                        <div style={{ marginBottom: 18 }}>
                                            <label className="bold-text" style={{ display: 'block', marginBottom: 6, color: 'var(--primary-color)' }}>
                                                Voto (1-10)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                className="input-field"
                                                placeholder="S.V."
                                                value={stats[player.id]?.vote ?? voteInputs[player.id] ?? ''}
                                                onChange={e => {
                                                    const val = e.target.value;
                                                    setVoteInputs(prev => ({ ...prev, [player.id]: val }));
                                                    // Aggiorna lo stato globale solo se il valore è valido
                                                    if (val === '' || val.toUpperCase() === 'S.V.') {
                                                        handleVoteChange(player.id, '');
                                                    } else if (/^\d{1,2}([.,]\d?)?$/.test(val)) {
                                                        handleVoteChange(player.id, val.replace(',', '.'));
                                                    }
                                                }}
                                                style={{
                                                    width: '98%',
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold',
                                                    marginBottom: 0
                                                }}
                                            />
                                        </div>
                                        <div
                                            className="bonus-malus-grid"
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                                                gap: isMobile ? '12px' : '24px',
                                                marginBottom: 10
                                            }}
                                        >
                                            <div className="form-group">
                                                <label className="bold-text" style={{ color: 'green' }}>Bonus</label>
                                                <StatInput
                                                    label={statLabels.goals.full}
                                                    abbr={statLabels.goals.short}
                                                    value={stats[player.id]?.goals}
                                                    onIncrement={() => handleIncrement(player.id, 'goals')}
                                                    onDecrement={() => handleDecrement(player.id, 'goals')}
                                                    color="#6fcf97"
                                                />
                                                <StatInput
                                                    label={statLabels.assists.full}
                                                    abbr={statLabels.assists.short}
                                                    value={stats[player.id]?.assists}
                                                    onIncrement={() => handleIncrement(player.id, 'assists')}
                                                    onDecrement={() => handleDecrement(player.id, 'assists')}
                                                    color="#6fcf97"
                                                />
                                                {player.role === 'PORTIERE' && (
                                                    <StatInput
                                                        label={statLabels.penalties_saved.full}
                                                        abbr={statLabels.penalties_saved.short}
                                                        value={stats[player.id]?.penalties_saved}
                                                        onIncrement={() => handleIncrement(player.id, 'penalties_saved')}
                                                        onDecrement={() => handleDecrement(player.id, 'penalties_saved')}
                                                        color="#6fcf97"
                                                    />
                                                )}
                                            </div>
                                            <div className="form-group">
                                                <label className="bold-text" style={{ color: '#d32f2f' }}>Malus</label>
                                                <StatInput
                                                    label={statLabels.yellow_cards.full}
                                                    abbr={statLabels.yellow_cards.short}
                                                    value={stats[player.id]?.yellow_cards}
                                                    onIncrement={() => handleIncrement(player.id, 'yellow_cards')}
                                                    onDecrement={() => handleDecrement(player.id, 'yellow_cards')}
                                                    color="#eb5757"
                                                />
                                                <StatInput
                                                    label={statLabels.red_card.full}
                                                    abbr={statLabels.red_card.short}
                                                    value={stats[player.id]?.red_card}
                                                    onIncrement={() => handleIncrement(player.id, 'red_card')}
                                                    onDecrement={() => handleDecrement(player.id, 'red_card')}
                                                    color="#eb5757"
                                                />
                                                <StatInput
                                                    label={statLabels.own_goals.full}
                                                    abbr={statLabels.own_goals.short}
                                                    value={stats[player.id]?.own_goals}
                                                    onIncrement={() => handleIncrement(player.id, 'own_goals')}
                                                    onDecrement={() => handleDecrement(player.id, 'own_goals')}
                                                    color="#eb5757"
                                                />
                                                <StatInput
                                                    label={statLabels.penalties_missed.full}
                                                    abbr={statLabels.penalties_missed.short}
                                                    value={stats[player.id]?.penalties_missed}
                                                    onIncrement={() => handleIncrement(player.id, 'penalties_missed')}
                                                    onDecrement={() => handleDecrement(player.id, 'penalties_missed')}
                                                    color="#eb5757"
                                                />
                                                {player.role === 'PORTIERE' && (
                                                    <StatInput
                                                        label={statLabels.goals_conceded.full}
                                                        abbr={statLabels.goals_conceded.short}
                                                        value={stats[player.id]?.goals_conceded}
                                                        onIncrement={() => handleIncrement(player.id, 'goals_conceded')}
                                                        onDecrement={() => handleDecrement(player.id, 'goals_conceded')}
                                                        color="#eb5757"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="modal-actions enhanced-modal-actions">
                    <button type="button" onClick={onClose} className="button cancel" disabled={saving}>Annulla</button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="button save"
                        disabled={saving}
                    >
                        {saving ? "Salvataggio in corso..." : "Salva Statistiche"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MatchStatsManager;
