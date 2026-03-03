const { Bot, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_TOKEN);
const APP_URL = process.env.APP_URL;

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

async function notify(tgId, message) {
  try {
    await bot.api.sendMessage(tgId, message);
  } catch (err) {
    console.error('Ошибка отправки уведомления:', err.message);
  }
}

async function startBot(attempt = 1) {
  if (attempt > 5) {
    console.log('Бот: превышено количество попыток, пропускаем');
    return;
  }
  try {
    await bot.start({
      onStart: () => console.log('Бот запущен'),
      drop_pending_updates: true
    });
  } catch (err) {
    if (err.error_code === 409) {
      console.log(`Конфликт — попытка ${attempt}/5, ждём ${attempt * 5} сек...`);
      setTimeout(() => startBot(attempt + 1), attempt * 5000);
    } else {
      console.error('Ошибка бота:', err.message);
    }
  }
}

module.exports = { bot, notify, startBot };
