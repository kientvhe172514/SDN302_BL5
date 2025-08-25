const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { checkAuth } = require('../middleware/authorization');
const verifyToken = require('../middleware/verifyToken');

// add a user
router.post("/add-user", checkAuth, userController.addUser);
// login
router.post("/login", userController.login);
// get all user
router.get('/get-all', checkAuth, userController.getAllUser);

// Profile routes
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateProfile);

module.exports = router;