const supabase = require('../services/supabase');

async function health(req, res) {
  res.json({ ok: true, status: 'alive', timestamp: new Date().toISOString() });
}

async function ready(req, res) {
  try {
    var result = await supabase.from('tournaments').select('id').limit(1);
    if (result.error) throw result.error;
    res.json({ ok: true, status: 'ready', db: 'connected' });
  } catch (err) {
    res.status(503).json({ ok: false, status: 'not ready', db: err.message });
  }
}

module.exports = { health, ready };
