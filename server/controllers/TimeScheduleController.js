const TimeScheduleService = require('../services/TimeScheduleService');
const ApiError = require('../errors/api-error');

class TimeScheduleController {
    /**
     * Xử lý request lấy lịch học của sinh viên đang đăng nhập.
     */
    static async handleGetMySchedule(req, res, next) {
        try {
            const studentId = req.user.id; 
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
}

module.exports = TimeScheduleController;