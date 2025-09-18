const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';
import { getToken } from '../utils/auth';

export async function fetchMatchesDetails(championshipId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/matches/${championshipId}`, {
    headers: { 'Authorization': `Bearer ${getToken()}` },
  });
  if (!response.ok) {
    throw new Error('Errore durante il recupero dei dettagli delle partite');
  }
  return await response.json();
}

export async function fetchMatchDetails(matchId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/matches/single_match/${matchId}`, {
  headers: { 'Authorization': `Bearer ${getToken()}` }
      });
    if (!response.ok) throw new Error('Errore nel caricamento dei dettagli della partita');
    return await response.json();
 }

 
export async function fetchAddMatch(championshipId, matchData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/matches/${championshipId}/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matchData)
  });
  return await response;
}
export async function fetchUpdateMatch(matchId, matchData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/matches/${matchId}/update`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(matchData)
  });
  return await response;
}
export async function fetchDeleteMatch(matchId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/matches/${matchId}/delete`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
  return await response;
}

export async function fetchMatchStats(matchId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/matches/${matchId}/stats`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Errore durante il recupero delle statistiche della partita');
  }
  return await response.json();
}

export async function saveMatchStats(matchId, statsData) {
  const response = await fetch(`${API_BASE_URL}/api/v1/matches/${matchId}/stats`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(statsData)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Errore durante il salvataggio delle statistiche');
  }
}


export async function sendVotingClosedEmail(championshipId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/championships/${championshipId}/notify_voting_closed`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Errore durante l\'invio delle email ai partecipanti');
  }
}