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
}

module.exports = TimeScheduleController;