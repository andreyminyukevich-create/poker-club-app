const { Bot, InlineKeyboard } = require('grammy');
const config = require('./config');

let bot = null;

function getBot() {
  if (!bot && config.botToken) {
    bot = new Bot(config.botToken);
  }
  return bot;
}

async function notify(tgId, message) {
  var b = getBot();
  if (!b) return;
  try {
    await b.api.sendMessage(tgId, message);
  } catch (err) {
    console.error('[BOT] Notification error:', err.message);
  }
}

module.exports = { getBot, notify };
