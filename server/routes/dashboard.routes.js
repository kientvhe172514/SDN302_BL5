const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/Dashboard.controller');
const { checkAuth } = require('../middleware/authorization');

router.get('/',checkAuth,dashboardController.getStatistical)
module.exports = router