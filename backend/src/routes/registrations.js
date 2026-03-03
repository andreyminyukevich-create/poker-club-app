const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// Получить все записи на турнир
router.get('/tournament/:tournamentId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*, users(nickname, first_name)')
      .eq('tournament_id', req.params.tournamentId)
      .neq('status', 'отменён');

    if (error) throw error;
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Получить записи пользователя
router.get('/user/:tgId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*, tournaments(name, date, time)')
      .eq('tg_id', req.params.tgId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Записаться на турнир
router.post('/', async (req, res) => {
  try {
    const { tg_id, tournament_id } = req.body;

    // Проверяем не записан ли уже
    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('tg_id', tg_id)
      .eq('tournament_id', tournament_id)
      .neq('status', 'отменён')
      .single();

    if (existing) {
      return res.status(400).json({ ok: false, error: 'Вы уже записаны на этот турнир' });
    }

    // Проверяем лимит мест
    const { data: tournament } = await supabase
      .from('tournaments')
      .select('seats')
      .eq('id', tournament_id)
      .single();

    if (!tournament) {
      return res.status(404).json({ ok: false, error: 'Турнир не найден' });
    }

    const { count } = await supabase
      .from('registrations')
      .select('id', { count: 'exact' })
      .eq('tournament_id', tournament_id)
      .eq('status', 'записан');

    const status = count >= tournament.seats ? 'лист ожидания' : 'записан';

    const { error } = await supabase
      .from('registrations')
      .insert({ tg_id, tournament_id, status });

    if (error) throw error;
    res.json({ ok: true, status });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Отменить запись
router.post('/cancel', async (req, res) => {
  try {
    const { tg_id, tournament_id } = req.body;

    const { error } = await supabase
      .from('registrations')
      .update({ status: 'отменён' })
      .eq('tg_id', tg_id)
      .eq('tournament_id', tournament_id)
      .neq('status', 'отменён');

    if (error) throw error;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
