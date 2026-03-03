const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/health');

router.get('/health', ctrl.health);
router.get('/ready', ctrl.ready);

module.exports = router;
