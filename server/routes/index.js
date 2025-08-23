const express = require('express');
const router = express.Router();
const userRouter = require('../routes/user.routes');
const subjectRouter = require('../routes/subject.routes');

router.use('/user', userRouter);
router.use('/subjects', subjectRouter);

module.exports = router;
