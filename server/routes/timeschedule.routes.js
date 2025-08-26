const express = require('express');
const router = express.Router();
const TimeScheduleController = require('../controllers/TimeScheduleController');

router.get('/my-schedule',TimeScheduleController.handleGetMySchedule);

module.exports = router;