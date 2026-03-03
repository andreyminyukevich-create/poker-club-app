const { Bot, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_TOKEN);

const APP_URL = process.env.APP_URL || 'https://poker-club-app-production-41ec.up.railway.app';

// Команда /start
bot.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard().webApp(
    '🃏 Открыть приложение',
    APP_URL
  );

  await ctx.reply(
    'Добро пожаловать в Московский Покерный Зал! 🎴\n\nНажмите кнопку ниже чтобы открыть приложение:',
    { reply_markup: keyboard }
  );
});

// Уведомление игроку (вызывается из роутов)
async function notify(tgId, message) {
  try {
    await bot.api.sendMessage(tgId, message);
  } catch (err) {
    console.error('Ошибка отправки уведомления:', err.message);
  }
}

module.exports = { bot, notify };
