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

router.put('/update-class/:id',checkAuth,classController.updateAll)

router.delete('/delete/:id',checkAuth,classController.deleteClass)
module.exports = router;