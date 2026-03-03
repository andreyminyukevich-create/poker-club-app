import api from './client';

export function register(tournamentId) {
  return api.post('/api/registrations', { tournament_id: Number(tournamentId) });
}

export function cancel(tournamentId) {
  return api.post('/api/registrations/cancel', { tournament_id: Number(tournamentId) });
}

export function getByTournament(tournamentId) {
  return api.get('/api/registrations/tournament/' + tournamentId);
}

export function getMyRegistrations() {
  return api.get('/api/registrations/my');
}
