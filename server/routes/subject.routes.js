const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/SubjectController');
const verifyToken = require('../middleware/verifyToken');
const authorization = require('../middleware/authorization');

const subjectController = new SubjectController();

router.get('/stats', subjectController.getSubjectsStats);
router.get('/credits', subjectController.getSubjectsByCredits);

router.use(verifyToken);

// Admin only routes
router.post('/', authorization('admin'), subjectController.createSubject);
router.put('/:id', authorization('admin'), subjectController.updateSubject);
router.delete('/:id', authorization('admin'), subjectController.deleteSubject);

// Admin and teacher routes
router.get('/', authorization('admin', 'teacher'), subjectController.getAllSubjects);
router.get('/:id', authorization('admin', 'teacher'), subjectController.getSubjectById);
router.get('/code/:subjectCode', authorization('admin', 'teacher'), subjectController.getSubjectByCode);

module.exports = router;
