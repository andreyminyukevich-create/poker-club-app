const supabase = require('./supabase');

async function getAll(filters) {
  let query = supabase.from('ratings').select('*, users(photo_url)').order('points', { ascending: false });
  if (filters && filters.city) query = query.eq('city', filters.city);
  if (filters && filters.season) query = query.eq('season', Number(filters.season));
  if (filters && filters.search) query = query.ilike('nickname', '%' + filters.search + '%');
  if (filters && filters.limit) query = query.limit(Number(filters.limit));
  if (filters && filters.offset) query = query.range(Number(filters.offset), Number(filters.offset) + Number(filters.limit || 50) - 1);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(function(r, i) {
    var photoUrl = r.users ? r.users.photo_url : null;
    return Object.assign({}, r, { position: i + 1, photo_url: photoUrl });
  });
}

async function getByUser(tgId) {
  const { data, error } = await supabase
    .from('ratings').select('*').eq('tg_id', tgId).maybeSingle();
  if (error) throw error;
  return data;
}

module.exports = { getAll, getByUser };
