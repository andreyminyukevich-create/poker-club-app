const { Bot, InlineKeyboard } = require('grammy');
const config = require('./config');

function startBot(attempt) {
  attempt = attempt || 1;
  if (attempt > 5) {
    console.log('[BOT] Max retries exceeded');
    return;
  }

  var bot = new Bot(config.botToken);

  bot.command('start', async function(ctx) {
    var keyboard = new InlineKeyboard().webApp(
      '🃏 Открыть приложение',
      config.appUrl
    );
    await ctx.reply(
      'Добро пожаловать в Московский Покерный Зал! 🎴\n\nНажмите кнопку ниже чтобы открыть приложение:',
      { reply_markup: keyboard }
    );
  });

  bot.start({
    onStart: function() { console.log('[BOT] Started'); },
    drop_pending_updates: true,
  }).catch(function(err) {
    if (err.error_code === 409) {
      console.log('[BOT] Conflict, retry ' + attempt + '/5');
      setTimeout(function() { startBot(attempt + 1); }, attempt * 5000);
    } else {
      console.error('[BOT] Error:', err.message);
    }
  });
}

module.exports = startBot;