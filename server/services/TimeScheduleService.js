const Class = require('../model/Class'); // Sử dụng model Class
const TimeSchedule = require('../model/TimeSchedule');

class TimeScheduleService {
    /**
     * Lấy toàn bộ lịch học của một sinh viên.
     * @param {string} studentId - ID của sinh viên
     * @returns {Promise<Array>} - Mảng các lịch học đã được populate thông tin chi tiết
     */
    static async getStudentSchedule(studentId) {
        // 1. Tìm tất cả các lớp có chứa studentId trong mảng 'students'
        const studentClasses = await Class.find({ students: studentId }).select('_id').lean();
        if (!studentClasses || studentClasses.length === 0) {
            return []; // Sinh viên này chưa được xếp vào lớp nào
        }
        // 2. Lấy ra danh sách ID của các lớp học
        const classIds = studentClasses.map(cls => cls._id);
        // 3. Tìm tất cả lịch học thuộc các lớp đó (logic này giữ nguyên)
        const schedules = await TimeSchedule.find({ class: { $in: classIds } })
            .populate({
                path: 'class',
                select: 'classCode subject semester',
                populate: {
                    path: 'subject',
                    select: 'subjectName subjectCode'
                }
            })
            .populate('teacher', 'fullName email')
            .sort({ dayOfWeek: 1, startTime: 1 })
            .lean();

        return schedules;
    }
}

module.exports = TimeScheduleService;
