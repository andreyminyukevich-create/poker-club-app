const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/registrations');
const { authRequired } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { registerSchema, cancelSchema } = require('../validators/registrations');

router.get('/tournament/:tournamentId', ctrl.getByTournament);
router.get('/my', authRequired, ctrl.getMyRegistrations);
router.post('/', authRequired, validate(registerSchema), ctrl.register);
router.post('/cancel', authRequired, validate(cancelSchema), ctrl.cancel);

module.exports = router;
