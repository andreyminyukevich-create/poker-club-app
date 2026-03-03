require('dotenv').config();
const { Bot, InlineKeyboard } = require('grammy');
const config = require('./config');

if (!config.botToken) {
  console.error('BOT_TOKEN not set');
  process.exit(1);
}

const bot = new Bot(config.botToken);

bot.command('start', async function(ctx) {
  var keyboard = new InlineKeyboard().webApp('Open App', config.appUrl);
  await ctx.reply(
    'Welcome! Press the button below to open the app:',
    { reply_markup: keyboard }
  );
});

async function startBot(attempt) {
  attempt = attempt || 1;
  if (attempt > 5) {
    console.log('[BOT] Max retries exceeded');
    return;
  }
  try {
    await bot.start({
      onStart: function() { console.log('[BOT] Started'); },
      drop_pending_updates: true,
    });
  } catch (err) {
    if (err.error_code === 409) {
      console.log('[BOT] Conflict, retry ' + attempt + '/5');
      setTimeout(function() { startBot(attempt + 1); }, attempt * 5000);
    } else {
      console.error('[BOT] Error:', err.message);
    }
  }
}

startBot();
