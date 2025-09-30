const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';
import { getToken } from '../utils/auth';

export async function fetchPlayers(championshipId, activeOnly = false) {
    const response = await fetch(`${API_BASE_URL}/api/v1/championships/${championshipId}/players`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Errore nel caricamento dei giocatori");
    const players = await response.json();
    return activeOnly ? players.filter(player => player.is_active) : players;
}

export async function fetchPlayersForChampionship(championshipId) {
    const response = await fetch(`${API_BASE_URL}/api/v1/championships/${championshipId}/players`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Errore nel caricamento dei giocatori per il campionato");
    return await response.json();
}

export async function fetchTeamPlayers(championshipId, ownerId) {
    const response = await fetch(`${API_BASE_URL}/api/v1/championships/${championshipId}/teams/${ownerId}/players`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
    });
    if (!response.ok) throw new Error("Errore nel caricamento dei giocatori");
    const players = await response.json();
    return players;
}

export async function saveTeam(championshipId, ownerId, teamData) {
    const response = await fetch(`${API_BASE_URL}/api/v1/championships/${championshipId}/teams/${ownerId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Errore nel salvataggio della squadra");
    }
    return await response.json();
}

export async function addPlayer(championshipId, playerData) {
    const formData = new FormData();
    for (const key in playerData) {
        if (playerData[key] !== null) {
            formData.append(key, playerData[key]);
        }
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/championships/${championshipId}/players`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Errore durante la creazione del giocatore');
    }
    return response.json();
}

export async function updatePlayer(championshipId, playerId, playerData) {
    const formData = new FormData();
    // Aggiunge solo i campi da aggiornare
    formData.append('number', playerData.number);
    formData.append('role', playerData.role);
    formData.append('second_role', playerData.second_role);
    formData.append('value', playerData.value);
    formData.append('isActive', playerData.isActive);

    if (playerData.photo) {
        formData.append('photo', playerData.photo);
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/championships/${championshipId}/players/${playerId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Errore durante la modifica del giocatore');
    }
    return response.json();
}

export async function deletePlayer(championshipId, playerId) {
    const response = await fetch(`${API_BASE_URL}/api/v1/championships/${championshipId}/players/${playerId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Errore durante l\'eliminazione del giocatore');
    }
    // La DELETE ora restituisce 204 No Content, quindi non c'è corpo JSON
    return { success: true, playerId: playerId };
}


export async function fetchPlayersDetailsByIds(playerIds) {
    if (!playerIds || playerIds.length === 0) {
        return [];
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/players/details`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player_ids: playerIds })
    });

    if (!response.ok) {
        // Tentiamo di leggere un messaggio di errore dal corpo
        try {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Errore nel caricamento dei dettagli dei giocatori storici");
        } catch (e) {
            // Gestisce il caso in cui il corpo non sia JSON (es. 500 Internal Server Error)
            throw new Error(`Errore HTTP ${response.status} nel caricamento dei dettagli dei giocatori storici`);
        }
    }
    
    return response.json();
}
