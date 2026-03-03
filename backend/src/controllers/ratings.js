const ratingsService = require('../services/ratings');

async function getAll(req, res, next) {
  try {
    var data = await ratingsService.getAll(req.query);
    res.json({ ok: true, data: data });
  } catch (err) { next(err); }
}

async function getMyRating(req, res, next) {
  try {
    var data = await ratingsService.getByUser(req.tgUser.id);
    if (!data) return res.status(404).json({ ok: false, error: 'Rating not found' });
    res.json({ ok: true, data: data });
  } catch (err) { next(err); }
}

module.exports = { getAll, getMyRating };
