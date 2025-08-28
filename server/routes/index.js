
const express = require("express");
const router = express.Router();
const userRouter = require("../routes/user.routes");
const classRouter = require("../routes/class.routes");
const subjectRouter = require("../routes/subject.routes");
const applicationRouter = require("../routes/Application.routers");
const wishlistRouter = require("../routes/wishlist.routers");
const timeScheduleRoutes = require("../routes/timeSchedule.routes");
const registrationRouter = require("../routes/registration.routes");
const dashboardRouter = require('../routes/dashboard.routes')
const RoomRouter = require('./Room.router');
router.use("/class", classRouter);
router.use("/user", userRouter);
router.use("/subjects", subjectRouter);
router.use("/applications", applicationRouter);
router.use("/wishlists", wishlistRouter);
router.use('/schedules', timeScheduleRoutes);
router.use('/registrations', registrationRouter);
router.use('/dashboard',dashboardRouter)
router.use('/rooms', RoomRouter);
module.exports = router;