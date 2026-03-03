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

router.post('/', async (req, res) => {
  try {
    const { tg_id, first_name, last_name, city } = req.body;

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

    const { data, error } = await supabase
      .from('users')
      .insert({ tg_id, nickname, first_name, last_name, city: city || '' })
      .select()
      .single();
    if (error) throw error;

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

router.patch('/:tgId/nickname', async (req, res) => {
  try {
    const { nickname } = req.body;
    if (!nickname?.trim()) {
      return res.status(400).json({ ok: false, error: 'Никнейм не может быть пустым' });
    }

    const { data: taken } = await supabase
      .from('users')
      .select('tg_id')
      .eq('nickname', nickname.trim())
      .neq('tg_id', req.params.tgId)
      .single();

    if (taken) {
      return res.status(400).json({ ok: false, error: 'Этот никнейм уже занят' });
    }

    await supabase
      .from('users')
      .update({ nickname: nickname.trim() })
      .eq('tg_id', req.params.tgId);

    await supabase
      .from('ratings')
      .update({ nickname: nickname.trim() })
      .eq('tg_id', req.params.tgId);

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
