
const express = require("express");
const router = express.Router();
const userRouter = require("../routes/user.routes");
const classRouter = require("../routes/class.routes");
const subjectRouter = require("../routes/subject.routes");
const applicationRouter = require("../routes/Application.routers");
const wishlistRouter = require("../routes/wishlist.routers");

router.use("/class", classRouter);
router.use("/user", userRouter);
router.use("/subjects", subjectRouter);
router.use("/applications", applicationRouter);
router.use("/wishlists", wishlistRouter);
router.use('/schedules', timeScheduleRoutes);


module.exports = router;