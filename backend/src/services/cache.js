const cache = {};
const TTL = 30 * 1000; // 30 секунд

function get(key) {
  const item = cache[key];
  if (!item) return null;
  if (Date.now() > item.expires) {
    delete cache[key];
    return null;
  }
  return item.data;
}

function set(key, data) {
  cache[key] = {
    data,
    expires: Date.now() + TTL
  };
}

function invalidate(key) {
  delete cache[key];
}

function invalidateAll() {
  Object.keys(cache).forEach(k => delete cache[k]);
}

module.exports = { get, set, invalidate, invalidateAll };
