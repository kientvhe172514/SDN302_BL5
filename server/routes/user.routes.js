const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { checkAuth } = require('../middleware/authorization');
// add a user
router.post("/add-user",checkAuth, userController.addUser);
// login
router.post("/login", userController.login);


module.exports = router;