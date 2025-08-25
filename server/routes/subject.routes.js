const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/SubjectController');
const verifyToken = require('../middleware/verifyToken');
const { checkAuth } = require('../middleware/authorization');

const subjectController = new SubjectController();

router.get('/stats',checkAuth, subjectController.getSubjectsStats);
router.get('/credits',checkAuth, subjectController.getSubjectsByCredits);

// router.use(verifyToken);

// Admin only routes
router.post('/',checkAuth, subjectController.createSubject);
router.put('/:id',checkAuth, subjectController.updateSubject);
router.delete('/:id',checkAuth, subjectController.deleteSubject);

// Admin and teacher routes
router.get('/',checkAuth, subjectController.getAllSubjects);
router.get('/:id',checkAuth, subjectController.getSubjectById);
router.get('/code/:subjectCode',checkAuth, subjectController.getSubjectByCode);

module.exports = router;
