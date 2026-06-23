
const express = require('express');
const router = express.Router();
const { getGrantDetails, getAvailableGrants } = require('../controllers/grantController');

// get /api/grants/available fetches list for dropdowns
router.get('/available', getAvailableGrants);

// get /api/grants fetches full report for a specific grant & month
router.get('/', getGrantDetails);

module.exports = router;