const express = require('express');
const router = express.Router();
const { getSheet } = require('../services/sheets');

function formatValue(value) {
  if (!value) return '';
  // Если уже строка типа "10.03" или "19:00" — не трогаем
  if (typeof value === 'string' && !value.includes('T')) return value;
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d;
}

function formatTournament(t) {
  const дата = formatValue(t.Дата);
  const время = formatValue(t.Время);

  let датаСтрока = '';
  let времяСтрока = '';

  if (дата instanceof Date) {
    датаСтрока = `${String(дата.getDate()).padStart(2,'0')}.${String(дата.getMonth()+1).padStart(2,'0')}`;
  } else {
    датаСтрока = String(дата);
  }

  if (время instanceof Date) {
    времяСтрока = `${String(время.getHours()).padStart(2,'0')}:${String(время.getMinutes()).padStart(2,'0')}`;
  } else {
    времяСтрока = String(время);
  }

  return { ...t, Дата: датаСтрока, Время: времяСтрока };
}

router.get('/', async (req, res) => {
  try {
    const tournaments = await getSheet('tournaments');
    res.json({ ok: true, data: tournaments.map(formatTournament) });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

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
