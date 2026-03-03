import api from './client';

export function getAll() {
  return api.get('/api/tournaments');
}

export function getById(id) {
  return api.get('/api/tournaments/' + id);
}
