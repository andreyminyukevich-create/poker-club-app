const express = require('express');
const router = express.Router();
const { getSheet, addRow, updateRow } = require('../services/sheets');

// Получить все записи на турнир
router.get('/tournament/:tournamentId', async (req, res) => {
  try {
    const registrations = await getSheet('registrations');
    const result = registrations.filter(
      r => String(r['ID турнира']) === String(req.params.tournamentId)
    );
    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Получить записи пользователя
router.get('/user/:tgId', async (req, res) => {
  try {
    const registrations = await getSheet('registrations');
    const result = registrations.filter(
      r => String(r.TG_ID) === String(req.params.tgId)
    );
    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Записаться на турнир
router.post('/', async (req, res) => {
  try {
    const { tg_id, tournament_id } = req.body;

    // Проверяем не записан ли уже
    const registrations = await getSheet('registrations');
    const existing = registrations.find(
      r => String(r.TG_ID) === String(tg_id) &&
           String(r['ID турнира']) === String(tournament_id) &&
           r.Статус !== 'отменён'
    );
    if (existing) {
      return res.status(400).json({ ok: false, error: 'Вы уже записаны на этот турнир' });
    }

    // Проверяем лимит мест
    const tournaments = await getSheet('tournaments');
    const tournament = tournaments.find(t => String(t.ID) === String(tournament_id));
    if (!tournament) return res.status(404).json({ ok: false, error: 'Турнир не найден' });

    const activeRegs = registrations.filter(
      r => String(r['ID турнира']) === String(tournament_id) && r.Статус === 'записан'
    );

    const status = activeRegs.length >= Number(tournament['Мест всего'])
      ? 'лист ожидания'
      : 'записан';

    const newId = Date.now().toString();
    await addRow('registrations', {
      ID: newId,
      TG_ID: tg_id,
      'ID турнира': tournament_id,
      Статус: status,
      'Дата записи': new Date().toLocaleDateString('ru-RU')
    });

    res.json({ ok: true, status });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Отменить запись
router.post('/cancel', async (req, res) => {
  try {
    const { tg_id, tournament_id } = req.body;
    const registrations = await getSheet('registrations');
    const reg = registrations.find(
      r => String(r.TG_ID) === String(tg_id) &&
           String(r['ID турнира']) === String(tournament_id) &&
           r.Статус !== 'отменён'
    );
    if (!reg) return res.status(404).json({ ok: false, error: 'Запись не найдена' });

    await updateRow('registrations', reg.ID, { ...reg, Статус: 'отменён' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
