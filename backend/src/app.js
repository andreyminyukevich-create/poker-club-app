require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { startBot } = require('./bot');

const tournamentsRouter = require('./routes/tournaments');
const usersRouter = require('./routes/users');
const registrationsRouter = require('./routes/registrations');
const ratingsRouter = require('./routes/ratings');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/tournaments', tournamentsRouter);
app.use('/api/users', usersRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/ratings', ratingsRouter);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Московский Покерный Зал API' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

if (process.env.BOT_TOKEN) {
  startBot();
} else {
  console.log('BOT_TOKEN не указан — бот не запущен');
}
