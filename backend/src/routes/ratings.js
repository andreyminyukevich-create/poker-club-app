const express = require('express');
const router = express.Router();
const { getSheet } = require('../services/sheets');

// Получить рейтинг (с фильтрами)
router.get('/', async (req, res) => {
  try {
    const { city, season, search } = req.query;
    let ratings = await getSheet('ratings');

    // Фильтр по городу
    if (city) {
      ratings = ratings.filter(r => r.Город === city);
    }

    // Фильтр по сезону
    if (season) {
      ratings = ratings.filter(r => String(r.Сезон) === String(season));
    }

    // Поиск по никнейму
    if (search) {
      ratings = ratings.filter(r =>
        r.Никнейм && r.Никнейм.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Сортировка по очкам
    ratings.sort((a, b) => Number(b.Очки) - Number(a.Очки));

    // Добавляем позицию
    const result = ratings.map((r, i) => ({ ...r, Позиция: i + 1 }));

    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Получить рейтинг одного игрока
router.get('/:tgId', async (req, res) => {
  try {
    const ratings = await getSheet('ratings');
    const player = ratings.find(r => String(r.TG_ID) === String(req.params.tgId));
    if (!player) return res.status(404).json({ ok: false, error: 'Игрок не найден' });
    res.json({ ok: true, data: player });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
