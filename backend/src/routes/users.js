const express = require('express');
const router = express.Router();
const { getSheet, addRow, updateRow } = require('../services/sheets');

const ADJECTIVES = [
  'Звёздный', 'Лунный', 'Солнечный', 'Тёмный', 'Огненный',
  'Ледяной', 'Золотой', 'Серебряный', 'Дикий', 'Тихий',
  'Быстрый', 'Хитрый', 'Смелый', 'Острый', 'Железный'
];

const NOUNS = [
  'Орион', 'Сириус', 'Вега', 'Альтаир', 'Денеб',
  'Арктур', 'Ригель', 'Антарес', 'Кастор', 'Поллукс',
  'Альдебаран', 'Капелла', 'Процион', 'Спика', 'Регул'
];

function generateNickname() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj} ${noun} ${num}`;
}

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
    const { tg_id, first_name, last_name, city } = req.body;
    const users = await getSheet('users');
    const exists = users.find(u => String(u.TG_ID) === String(tg_id));

    if (exists) {
      await updateRow('users', tg_id, {
        TG_ID: tg_id,
        Никнейм: exists.Никнейм,
        Имя: first_name,
        Фамилия: last_name,
        Город: city || exists.Город
      });
      res.json({ ok: true, data: exists });
    } else {
      // Генерируем уникальный ник
      let nickname = generateNickname();
      let attempts = 0;
      while (users.find(u => u.Никнейм === nickname) && attempts < 10) {
        nickname = generateNickname();
        attempts++;
      }

      await addRow('users', {
        TG_ID: tg_id,
        Никнейм: nickname,
        Имя: first_name,
        Фамилия: last_name,
        Город: city || '',
        'Дата регистрации': new Date().toLocaleDateString('ru-RU')
      });
      res.json({ ok: true, data: { TG_ID: tg_id, Никнейм: nickname } });
    }
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Обновить никнейм
router.patch('/:tgId/nickname', async (req, res) => {
  try {
    const { nickname } = req.body;
    if (!nickname || !nickname.trim()) {
      return res.status(400).json({ ok: false, error: 'Никнейм не может быть пустым' });
    }

    const users = await getSheet('users');

    // Проверка уникальности
    const taken = users.find(
      u => u.Никнейм === nickname.trim() && String(u.TG_ID) !== String(req.params.tgId)
    );
    if (taken) {
      return res.status(400).json({ ok: false, error: 'Этот никнейм уже занят' });
    }

    const user = users.find(u => String(u.TG_ID) === String(req.params.tgId));
    if (!user) return res.status(404).json({ ok: false, error: 'Пользователь не найден' });

    await updateRow('users', req.params.tgId, { ...user, Никнейм: nickname.trim() });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
