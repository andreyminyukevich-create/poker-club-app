const supabase = require('./supabase');
const { generateNickname } = require('../utils/nickname');
const { NotFoundError, ConflictError } = require('../utils/errors');

async function upsertUser(tgId, firstName, lastName, city) {
  // Generate unique nickname
  let nickname = generateNickname();
  let attempts = 0;
  while (attempts < 10) {
    const { data: taken } = await supabase
      .from('users').select('tg_id').eq('nickname', nickname).maybeSingle();
    if (!taken) break;
    nickname = generateNickname();
    attempts++;
  }

  const { data, error } = await supabase.rpc('upsert_user_with_rating', {
    p_tg_id: tgId,
    p_nickname: nickname,
    p_first_name: firstName || '',
    p_last_name: lastName || '',
    p_city: city || '',
  });

  if (error) throw error;
  return data;
}

async function getUser(tgId) {
  const { data, error } = await supabase
    .from('users').select('*').eq('tg_id', tgId).maybeSingle();
  if (error) throw error;
  return data;
}

async function updateNickname(tgId, nickname) {
  const { data: taken } = await supabase
    .from('users').select('tg_id').eq('nickname', nickname).neq('tg_id', tgId).maybeSingle();
  if (taken) throw new ConflictError('Nickname already taken');

  const { error } = await supabase
    .from('users').update({ nickname: nickname }).eq('tg_id', tgId);
  if (error) throw error;

  await supabase.from('ratings').update({ nickname: nickname }).eq('tg_id', tgId);
  return true;
}

async function updateCity(tgId, city) {
  const { error } = await supabase
    .from('users').update({ city: city }).eq('tg_id', tgId);
  if (error) throw error;
  return true;
}

module.exports = { upsertUser, getUser, updateNickname, updateCity };
