const express = require('express');
const router = express.Router();
const TimeScheduleController = require('../controllers/TimeScheduleController');
const { checkAuth } = require('../middleware/authorization');
const verifyToken = require('../middleware/verifyToken');

router.get('/my-schedule',verifyToken,TimeScheduleController.handleGetMySchedule);
router.post('/assign-students',checkAuth,TimeScheduleController.handleAssignStudents);
router.post('/create',TimeScheduleController.handleCreateSchedule);
module.exports = router;