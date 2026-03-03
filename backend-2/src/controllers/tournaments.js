const tournamentsService = require('../services/tournaments');

async function getAll(req, res, next) {
  try {
    var data = await tournamentsService.getAll(req.query);
    res.json({ ok: true, data: data });
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    var data = await tournamentsService.getById(req.params.id);
    if (!data) return res.status(404).json({ ok: false, error: 'Tournament not found' });
    res.json({ ok: true, data: data });
  } catch (err) { next(err); }
}

module.exports = { getAll, getById };
