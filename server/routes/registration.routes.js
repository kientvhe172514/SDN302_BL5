const express = require('express');
const router = express.Router();
const RegistrationController = require('../controllers/RegistrationController');
const { checkAuth } = require('../middleware/authorization');
const verifyToken = require('../middleware/verifyToken');

router.post('/assign',checkAuth,RegistrationController.handleCreateRegistrations);

module.exports = router;