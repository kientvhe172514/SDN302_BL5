const express = require('express');
const router = express.Router();
const classController = require('../controllers/ClassController');
const { checkAuth } = require('../middleware/authorization');
// get all classes
router.get("/get-class",checkAuth, classController.getAllClass);

//add a class
router.post('/add-class',checkAuth,classController.addClass)

//get by id
router.get('/get-class/:classId',checkAuth,classController.getClassById)
module.exports = router;