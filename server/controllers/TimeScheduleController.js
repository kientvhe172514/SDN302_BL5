const TimeScheduleService = require('../services/TimeScheduleService');
const ApiError = require('../errors/api-error');

class TimeScheduleController {
    /**
     * Xử lý request lấy lịch học của sinh viên đang đăng nhập.
     */

    static async getDayOfWeekString () {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[new Date().getDay()];
    };

    static async handleGetMySchedule(req, res, next) {
        try {
            console.log("1. [handleGetMySchedule] Request received.", req.params.userId);
            const studentId = req.query.userId 
            if (!studentId) {
                throw new ApiError(401, 'Unauthorized: User ID not found.');
            }
            const schedule = await TimeScheduleService.getStudentSchedule(studentId);
            res.status(200).json({
                message: 'Successfully fetched student schedule.',
                data: schedule
            });
        } catch (error) {
            next(error);
        }
    }

    static async handleAssignStudents(req, res, next) {
        try {
            const { subjectId, semester, studentIds } = req.body;

            // Validate input
            if (!subjectId || !semester || !Array.isArray(studentIds) || studentIds.length === 0) {
                return res.status(400).json({ message: 'subjectId, semester, and a non-empty studentIds array are required.' });
            }

            // Gọi hàm assignStudentsToClasses từ TimeScheduleService
            const result = await TimeScheduleService.assignStudentsToClasses(subjectId, semester, studentIds);

            res.status(200).json({
                message: 'Student assignment process completed.',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async handleCreateSchedule(req, res, next) {
        try {
            // Lấy tất cả dữ liệu cần thiết từ body
            const scheduleData = req.body;

            // Validate input cơ bản
            if (!scheduleData.classId || !scheduleData.teacherId || !scheduleData.slotNumber) {
                return res.status(400).json({ message: 'classId, teacherId, and slotNumber are required.' });
            }

            const result = await TimeScheduleService.createSchedule(scheduleData);
            res.status(201).json(result);
        } catch (error) {
            next(error); // Chuyển lỗi đến global error handler
        }
    }

    static async getAvailability(req, res, next) {
        try {
            const { classId, teacherId, dayOfWeek } = req.query;
            if (!classId || !teacherId || !dayOfWeek) {
                throw new ApiError(400, "Class ID, Teacher ID, and Day of Week are required.");
            }
            const availability = await TimeScheduleService.getScheduleAvailability(classId, teacherId, dayOfWeek);
            res.status(200).json(availability);
        } catch (error) {
            next(error);
        }
    };

    static async getTeacherSchedulesForToday (req, res, next) {
        try {
            const teacherId = req.user.id; // Lấy từ authMiddleware
            const today = getDayOfWeekString();
    
            const schedules = await TimeSchedule.find({ teacher: teacherId, dayOfWeek: today })
                .populate({
                    path: 'class',
                    select: 'classCode subject',
                    populate: {
                        path: 'subject',
                        select: 'subjectName'
                    }
                })
                .populate('room', 'roomCode')
                .sort({ slotNumber: 'asc' });
    
            if (!schedules) {
                return res.status(200).json({
                    success: true,
                    message: "Hôm nay không có lịch dạy.",
                    data: []
                });
            }
    
            res.status(200).json({
                success: true,
                count: schedules.length,
                data: schedules
            });
    
        } catch (error) {
            next(error);
        }
    };
}

module.exports = TimeScheduleController;