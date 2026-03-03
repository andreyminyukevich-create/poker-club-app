const API_URL = import.meta.env.VITE_API_URL;

function getInitData() {
  try {
    return window.Telegram?.WebApp?.initData || '';
  } catch (e) {
    return '';
  }
}

async function request(path, options) {
  var url = API_URL + path;
  var headers = {
    'Content-Type': 'application/json',
    'X-Telegram-Init-Data': getInitData(),
  };

  var config = Object.assign({}, options || {}, {
    headers: Object.assign(headers, (options && options.headers) || {}),
  });

  var response = await fetch(url, config);
  var data = await response.json();

  if (!response.ok && !data.ok) {
    var err = new Error(data.message || data.error || 'Request failed');
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

function get(path) {
  return request(path, { method: 'GET' });
}

function post(path, body) {
  return request(path, {
    method: 'POST',
    body: JSON.stringify(body || {}),
  });
}

function patch(path, body) {
  return request(path, {
    method: 'PATCH',
    body: JSON.stringify(body || {}),
  });
}

export default { get, post, patch, request };
