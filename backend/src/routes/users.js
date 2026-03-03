const express = require('express');
const router = express.Router();
const { getSheet, addRow, updateRow } = require('../services/sheets');

// Получить пользователя по TG_ID
router.get('/:tgId', async (req, res) => {
  try {
    const users = await getSheet('users');
    const user = users.find(u => String(u.TG_ID) === String(req.params.tgId));
    if (!user) return res.status(404).json({ ok: false, error: 'Пользователь не найден' });
    res.json({ ok: true, data: user });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Зарегистрировать / обновить пользователя
router.post('/', async (req, res) => {
  try {
    const { tg_id, nickname, first_name, last_name, city } = req.body;
    const users = await getSheet('users');
    const exists = users.find(u => String(u.TG_ID) === String(tg_id));

    if (exists) {
      await updateRow('users', tg_id, {
        TG_ID: tg_id,
        Никнейм: nickname || exists.Никнейм,
        Имя: first_name,
        Фамилия: last_name,
        Город: city || exists.Город
      });
    } else {
      await addRow('users', {
        TG_ID: tg_id,
        Никнейм: nickname || first_name,
        Имя: first_name,
        Фамилия: last_name,
        Город: city || '',
        'Дата регистрации': new Date().toLocaleDateString('ru-RU')
      });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
