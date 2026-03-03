import api from './client';

export function registerMe() {
  return api.post('/api/users');
}

export function getMe() {
  return api.get('/api/users/me');
}

export function updateNickname(nickname) {
  return api.patch('/api/users/me/nickname', { nickname: nickname });
}

export function updateCity(city) {
  return api.patch('/api/users/me/city', { city: city });
}
