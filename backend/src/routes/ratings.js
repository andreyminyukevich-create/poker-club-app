const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// Получить рейтинг
router.get('/', async (req, res) => {
  try {
    const { city, season, search } = req.query;

    let query = supabase
      .from('ratings')
      .select('*')
      .order('points', { ascending: false });

    if (city) query = query.eq('city', city);
    if (season) query = query.eq('season', Number(season));
    if (search) query = query.ilike('nickname', `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;

    const result = data.map((r, i) => ({ ...r, position: i + 1 }));
    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Получить рейтинг игрока
router.get('/:tgId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('tg_id', req.params.tgId)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ ok: false, error: 'Игрок не найден' });
    }
    if (error) throw error;
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
