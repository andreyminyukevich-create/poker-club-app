const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

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
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('tg_id', req.params.tgId)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ ok: false, error: 'Пользователь не найден' });
    }
    if (error) throw error;
    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Зарегистрировать / обновить пользователя
router.post('/', async (req, res) => {
  try {
    const { tg_id, first_name, last_name, city } = req.body;

    // Проверяем существует ли пользователь
    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('tg_id', tg_id)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('users')
        .update({ first_name, last_name, city: city || existing.city })
        .eq('tg_id', tg_id)
        .select()
        .single();
      if (error) throw error;
      return res.json({ ok: true, data });
    }

    // Генерируем уникальный ник
    let nickname = generateNickname();
    let attempts = 0;
    while (attempts < 10) {
      const { data: taken } = await supabase
        .from('users')
        .select('tg_id')
        .eq('nickname', nickname)
        .single();
      if (!taken) break;
      nickname = generateNickname();
      attempts++;
    }

    // Создаём пользователя
    const { data, error } = await supabase
      .from('users')
      .insert({ tg_id, nickname, first_name, last_name, city: city || '' })
      .select()
      .single();
    if (error) throw error;

    // Добавляем в рейтинг с нулями
    await supabase.from('ratings').insert({
      tg_id,
      nickname,
      season: new Date().getFullYear(),
      knockouts: 0,
      points: 0,
      city: city || ''
    });

    res.json({ ok: true, data });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Обновить никнейм
router.patch('/:tgId/nickname', async (req, res) => {
  try {
    const { nickname } = req.body;
    if (!nickname?.trim()) {
      return res.status(400).json({ ok: false, error: 'Никнейм не может быть пустым' });
    }

    // Проверка уникальности
    const { data: taken } = await supabase
      .from('users')
      .select('tg_id')
      .eq('nickname', nickname.trim())
      .neq('tg_id', req.params.tgId)
      .single();

    if (taken) {
      return res.status(400).json({ ok: false, error: 'Этот никнейм уже занят' });
    }

    // Обновляем в users
    await supabase
      .from('users')
      .update({ nickname: nickname.trim() })
      .eq('tg_id', req.params.tgId);

    // Обновляем в ratings
    await supabase
      .from('ratings')
      .update({ nickname: nickname.trim() })
      .eq('tg_id', req.params.tgId);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;          TG_ID: tg_id,
          Никнейм: nickname,
          Сезон: new Date().getFullYear(),
          Ноки: 0,
          Очки: 0,
          Город: city || ''
        });
      }

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

    const taken = users.find(
      u => u.Никнейм === nickname.trim() && String(u.TG_ID) !== String(req.params.tgId)
    );
    if (taken) {
      return res.status(400).json({ ok: false, error: 'Этот никнейм уже занят' });
    }

    const user = users.find(u => String(u.TG_ID) === String(req.params.tgId));
    if (!user) return res.status(404).json({ ok: false, error: 'Пользователь не найден' });

    // Обновляем ник в users
    await updateRow('users', req.params.tgId, { ...user, Никнейм: nickname.trim() });

    // Обновляем ник в ratings
    const ratings = await getSheet('ratings');
    const rating = ratings.find(r => String(r.TG_ID) === String(req.params.tgId));
    if (rating) {
      await updateRow('ratings', req.params.tgId, { ...rating, Никнейм: nickname.trim() });
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;// Обновить никнейм
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
