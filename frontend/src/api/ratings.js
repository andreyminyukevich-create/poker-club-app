import api from './client';

export function getAll(params) {
  var query = '';
  if (params) {
    var parts = [];
    Object.keys(params).forEach(function(k) {
      if (params[k]) parts.push(k + '=' + encodeURIComponent(params[k]));
    });
    if (parts.length) query = '?' + parts.join('&');
  }
  return api.get('/api/ratings' + query);
}

export function getMyRating() {
  return api.get('/api/ratings/me');
}
