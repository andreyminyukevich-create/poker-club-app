const express = require('express');
const router = express.Router();
const { getSheet } = require('../services/sheets');

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}`;
}

function formatTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${mins}`;
}

function formatTournament(t) {
  return {
    ...t,
    Дата: formatDate(t.Дата),
    Время: formatTime(t.Время)
  };
}

// Получить все турниры
router.get('/', async (req, res) => {
  try {
    const tournaments = await getSheet('tournaments');
    res.json({ ok: true, data: tournaments.map(formatTournament) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Получить турнир по ID
router.get('/:id', async (req, res) => {
  try {
    const tournaments = await getSheet('tournaments');
    const tournament = tournaments.find(t => String(t.ID) === String(req.params.id));
    if (!tournament) return res.status(404).json({ ok: false, error: 'Турнир не найден' });
    res.json({ ok: true, data: formatTournament(tournament) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
