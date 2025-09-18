import { apiFetch } from './apiClient';

export async function fetchChampionships(excludedId = null) {
    const response = await apiFetch(`/api/v1/championships/`);
    if (!response.ok) throw new Error('Errore nel caricamento');
    const data = await response.json();
    return data.filter(c => c.id.toString() !== excludedId);
}

export async function fetchChampionshipsCreated(excludedId = null) {
    const response = await apiFetch(`/api/v1/championships/created`);
    if (!response.ok) throw new Error('Errore nel caricamento');
    const data = await response.json();
    return data.filter(c => c.id.toString() !== excludedId);
}

export async function clonePlayersFromChampionship(sourceChampionshipId, targetChampionshipId) {
    const response = await apiFetch(`/api/v1/championships/${targetChampionshipId}/import_players`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source_championship_id: parseInt(sourceChampionshipId) })
    });
    if (!response.ok) throw new Error('Errore nell\'importazione');
    return await response.json();
}

export async function fetchChampionshipRanking(championshipId) {
    const response = await apiFetch(`/api/v1/championships/${championshipId}/ranking`);
    if (!response.ok) throw new Error('Errore nel caricamento della classifica');
    return await response.json();
}

export async function fetchDashboardData(championshipId) {
    const response = await apiFetch(`/api/v1/championships/${championshipId}/dashboard_data`);
    if (!response.ok) {
        throw new Error('Errore nel caricamento dei dati della dashboard');
    }
    return await response.json();
}
export async function fetchChampionshipDetails(championshipId) {
    const response = await apiFetch(`/api/v1/championships/${championshipId}`);
    if (!response.ok) throw new Error('Errore nel caricamento dei dettagli del campionato');
    return await response.json();
}

export async function fetchChampionshipParticipants(championshipId) {
    const response = await apiFetch(`/api/v1/championships/${championshipId}/participants`);
    if (!response.ok) {
        throw new Error('Errore nel caricamento dei partecipanti del campionato');
    }
    return await response.json();
}
//Cambia lo stato del campionato, in modo da poterlo visualizzare nella pagina dei campionati
export async function fetchChangeChampionshipProps(championshipId, new_budget, new_status = '') {
    const updateData = {};
    if (new_budget !== null && new_budget !== undefined) updateData.budget_per_user = new_budget;
    if (new_status) updateData.status = new_status;

    const response = await apiFetch(`/api/v1/championships/${championshipId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
    });
    return await response;
}

export async function createChampionship(championshipData) {
    const formData = new FormData();
    formData.append('name', championshipData.name);
    if (championshipData.alias) {
        formData.append('alias', championshipData.alias);
    }
    formData.append('logo', championshipData.logoFile);
    formData.append('sport_type', championshipData.sport_type);
    // Aggiungi altri campi se necessario, con valori di default
    formData.append('budget_per_user', championshipData.budget_per_user || 1000);
    formData.append('status', championshipData.status || '00');
    formData.append('is_active', championshipData.is_active !== undefined ? championshipData.is_active : true);

    const response = await apiFetch(`/api/v1/championships/create_championship`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Errore durante la creazione del campionato.');
    }
    return response.json();
}

export async function joinChampionship(code) {
    const response = await apiFetch(`/api/v1/championships/join/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code })
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Codice non valido o errore del server.');
    }
    return response.json();
}

export async function fetchMyChampionships() {
    const response = await apiFetch(`/api/v1/users/me/championships/`);
    if (!response.ok) throw new Error('Errore nel caricamento dei tuoi campionati');
    return await response.json();
}

export async function updateChampionshipStatus(championshipId, newStatus) {
    const response = await apiFetch(`/api/v1/championships/${championshipId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Errore durante l\'aggiornamento dello stato del campionato.');
    }

    return await response.json();
}
