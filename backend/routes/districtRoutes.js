
const express = require('express');
const router = express.Router();
const { getDistrictPerformance } = require('../controllers/districtController');

// get /api/districts
router.get('/', getDistrictPerformance);

module.exports = router;