const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ratings');
const { authRequired } = require('../middlewares/auth');

router.get('/', ctrl.getAll);
router.get('/me', authRequired, ctrl.getMyRating);

module.exports = router;
