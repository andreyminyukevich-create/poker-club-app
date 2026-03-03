const regService = require('../services/registrations');
const { notify } = require('../bot');

async function register(req, res, next) {
  try {
    var result = await regService.register(req.tgUser.id, req.validated.tournament_id);
    res.json(result);
  } catch (err) { next(err); }
}

async function cancel(req, res, next) {
  try {
    var result = await regService.cancel(req.tgUser.id, req.validated.tournament_id);
    if (result.ok && result.promoted_tg_id) {
      notify(result.promoted_tg_id, '✅ Вам перешло место! Вы переведены из листа ожидания.');
    }
    res.json(result);
  } catch (err) { next(err); }
}

async function getByTournament(req, res, next) {
  try {
    var data = await regService.getByTournament(req.params.tournamentId);
    res.json({ ok: true, data: data });
  } catch (err) { next(err); }
}

async function getMyRegistrations(req, res, next) {
  try {
    var data = await regService.getByUser(req.tgUser.id);
    res.json({ ok: true, data: data });
  } catch (err) { next(err); }
}

module.exports = { register, cancel, getByTournament, getMyRegistrations };
