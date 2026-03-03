const usersService = require('../services/users');

async function upsertMe(req, res, next) {
  try {
    var tgUser = req.tgUser;
    var result = await usersService.upsertUser(
      tgUser.id, tgUser.first_name, tgUser.last_name, ''
    );
    res.json(result);
  } catch (err) { next(err); }
}

async function getMe(req, res, next) {
  try {
    var data = await usersService.getUser(req.tgUser.id);
    if (!data) return res.status(404).json({ ok: false, error: 'User not found' });
    res.json({ ok: true, data: data });
  } catch (err) { next(err); }
}

async function updateNickname(req, res, next) {
  try {
    await usersService.updateNickname(req.tgUser.id, req.validated.nickname);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

async function updateCity(req, res, next) {
  try {
    await usersService.updateCity(req.tgUser.id, req.validated.city);
    res.json({ ok: true });
  } catch (err) { next(err); }
}

module.exports = { upsertMe, getMe, updateNickname, updateCity };
