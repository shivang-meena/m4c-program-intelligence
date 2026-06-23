
const express = require('express');
const router = express.Router();
const { generateReportNarrative } = require('../controllers/narrativeController');

// post /api/narrative
router.post('/', generateReportNarrative);

module.exports = router;