const supabase = require('./supabase');

async function register(tgId, tournamentId) {
  const { data, error } = await supabase.rpc('register_for_tournament', {
    p_tg_id: tgId,
    p_tournament_id: tournamentId,
  });
  if (error) throw error;
  return data;
}

async function cancel(tgId, tournamentId) {
  const { data, error } = await supabase.rpc('cancel_registration', {
    p_tg_id: tgId,
    p_tournament_id: tournamentId,
  });
  if (error) throw error;
  return data;
}

async function getByTournament(tournamentId) {
  const { data, error } = await supabase
    .from('registrations')
    .select('*, users(nickname, first_name)')
    .eq('tournament_id', tournamentId)
    .neq('status', 'отменён')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

async function getByUser(tgId) {
  const { data, error } = await supabase
    .from('registrations')
    .select('*, tournaments!registrations_tournament_id_fk(name, date, time)')
    .eq('tg_id', tgId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

module.exports = { register, cancel, getByTournament, getByUser };
