const express = require('express');
const router = express.Router();
const userRouter = require('../routes/user.routes')
const classRouter = require('../routes/class.routes')
router.use('/user',userRouter);
router.use('/class',classRouter)
module.exports = router;
