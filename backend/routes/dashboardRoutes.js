
const express = require('express');
const router = express.Router();
const { getDashboardSummary } = require('../controllers/dashboardController');

// get /api/dashboard
router.get('/', getDashboardSummary);

module.exports = router;