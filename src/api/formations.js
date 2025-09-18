import { apiFetch } from './apiClient';

/**
 * Recupera la prossima partita disponibile per schierare la formazione.
 * @param {string} championshipId L'ID del campionato.
 * @returns {Promise<object|null>} I dati della partita o null se non ce ne sono.
 */
export const fetchNextMatchForFormation = async (championshipId) => {
    const response = await apiFetch(`/api/v1/championships/${championshipId}/next-match-for-formation`);

    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Errore nel recupero della prossima partita');
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
        return null;
    }

    const data = await response.json();
    return data; // Può essere `null` se l'endpoint restituisce `null` nel JSON
};


/**
 * Salva o aggiorna la formazione per una partita.
 * @param {string} matchId L'ID della partita.
 * @param {number[]} starters La lista degli ID dei giocatori titolari.
 * @param {number[]} reserves La lista degli ID dei giocatori in panchina.
 * @param {string} module Il modulo di gioco.
 * @returns {Promise<object>} I dati della formazione salvata.
 */
export const saveFormation = async (matchId, starters, reserves, module) => {
    const response = await apiFetch(`/api/v1/matches/${matchId}/formation`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
                },
        body: JSON.stringify({ 
            starters_player_ids: starters,
            reserves_player_ids: reserves,
            module: module
        }),
        });

        if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Errore nel salvataggio della formazione');
            }

        return response.json();
};

    /**
 * Recupera la formazione salvata per una partita.
 * @param {string} matchId L'ID della partita.
 * @returns {Promise<object|null>} I dati della formazione o null.
 */
    export const fetchFormation = async (matchId) => {
            const response = await apiFetch(`/api/v1/matches/${matchId}/formation`);

        if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error('Errore nel recupero della formazione');
            }
    return response.json();
};

/**
 * Recupera la formazione e le statistiche dei giocatori per una partita.
 * @param {string} matchId L'ID della partita.
 * @returns {Promise<object|null>} Un oggetto con `formation` e `stats`.
 */
export const fetchFormationWithStats = async (matchId) => {
    const response = await apiFetch(`/api/v1/matches/${matchId}/formation_with_stats`);

    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Errore nel recupero di formazione e statistiche');
    }

    return response.json();
};