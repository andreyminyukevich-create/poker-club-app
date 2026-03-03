const supabase = require('./supabase');

async function getAll(filters) {
  let query = supabase.from('tournaments').select('*').order('date', { ascending: true });
  if (filters && filters.status) query = query.eq('status', filters.status);
  if (filters && filters.city) query = query.eq('city', filters.city);
  if (filters && filters.upcoming) query = query.gte('date', new Date().toISOString().slice(0, 10));
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function getById(id) {
  const { data, error } = await supabase
    .from('tournaments').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

module.exports = { getAll, getById };
