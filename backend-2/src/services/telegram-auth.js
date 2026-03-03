const crypto = require('crypto');
const config = require('../config');

function verifyTelegramWebAppData(initData) {
  if (!initData) return null;
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;

  params.delete('hash');
  const entries = Array.from(params.entries()).sort(function(a, b) {
    return a[0].localeCompare(b[0]);
  });
  const dataCheckString = entries.map(function(pair) {
    return pair[0] + '=' + pair[1];
  }).join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(config.botToken)
    .digest();

  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  if (computedHash !== hash) return null;

  try {
    const userStr = params.get('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

module.exports = { verifyTelegramWebAppData };
