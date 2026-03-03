const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/users');
const { authRequired } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { nicknameSchema, citySchema } = require('../validators/users');

// All user routes require auth
router.use(authRequired);

router.post('/', ctrl.upsertMe);
router.get('/me', ctrl.getMe);
router.patch('/me/nickname', validate(nicknameSchema), ctrl.updateNickname);
router.patch('/me/city', validate(citySchema), ctrl.updateCity);

module.exports = router;
