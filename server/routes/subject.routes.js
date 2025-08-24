const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/SubjectController');
const verifyToken = require('../middleware/verifyToken');
const { checkAuth } = require('../middleware/authorization');

const subjectController = new SubjectController();

router.get('/stats', subjectController.getSubjectsStats);
router.get('/credits', subjectController.getSubjectsByCredits);

// router.use(verifyToken);

// Admin only routes
router.post('/', subjectController.createSubject);
router.put('/:id', subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

// Admin and teacher routes
router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.get('/code/:subjectCode', subjectController.getSubjectByCode);

module.exports = router;
