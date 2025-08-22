const express = require('express');
const router = express.Router();

// Import route modules
const userRoutes = require('./user.routes');
const subjectRoutes = require('./subject.routes');

// Define API routes
router.use('/api/users', userRoutes);
router.use('/api/subjects', subjectRoutes);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({
    message: 'FAP API Server',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      subjects: '/api/subjects'
    }
  });
});

module.exports = router;
