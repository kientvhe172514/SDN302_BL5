const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/SubjectController');
const verifyToken = require('../middleware/verifyToken');
const { checkAuth } = require('../middleware/authorization');

const subjectController = new SubjectController();

router.get('/stats', subjectController.getSubjectsStats);
router.get('/credits', subjectController.getSubjectsByCredits);

router.use(verifyToken);

// Admin only routes
router.post('/', checkAuth('admin'), subjectController.createSubject);
router.put('/:id', checkAuth('admin'), subjectController.updateSubject);
router.delete('/:id', checkAuth('admin'), subjectController.deleteSubject);

// Admin and teacher routes
router.get('/', checkAuth('admin', 'teacher'), subjectController.getAllSubjects);
router.get('/:id', checkAuth('admin', 'teacher'), subjectController.getSubjectById);
router.get('/code/:subjectCode', checkAuth('admin', 'teacher'), subjectController.getSubjectByCode);

module.exports = router;
