const express = require('express');
const router = express.Router();
const { getSheet } = require('../services/sheets');

// Получить все турниры
router.get('/', async (req, res) => {
  try {
    const tournaments = await getSheet('tournaments');
    res.json({ ok: true, data: tournaments });
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
    res.json({ ok: true, data: tournament });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
