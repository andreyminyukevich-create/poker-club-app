const { verifyTelegramWebAppData } = require('../services/telegram-auth');
const { AuthError } = require('../utils/errors');

function authRequired(req, res, next) {
  const initData = req.headers['x-telegram-init-data'];
  if (!initData) {
    return next(new AuthError('Missing Telegram init data'));
  }

  const tgUser = verifyTelegramWebAppData(initData);
  if (!tgUser || !tgUser.id) {
    return next(new AuthError('Invalid Telegram init data'));
  }

  req.tgUser = tgUser;
  next();
}

function authOptional(req, res, next) {
  const initData = req.headers['x-telegram-init-data'];
  if (initData) {
    const tgUser = verifyTelegramWebAppData(initData);
    if (tgUser && tgUser.id) {
      req.tgUser = tgUser;
    }
  }
  next();
}

module.exports = { authRequired, authOptional };
