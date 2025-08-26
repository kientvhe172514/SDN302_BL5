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

     /**
     * (LOGIC MỚI) Tự động gán một danh sách sinh viên vào các lớp học phần của một môn học.
     * @param {string} subjectId - ID của môn học.
     * @param {string} semester - Học kỳ (ví dụ: "Fall 2024").
     * @param {string[]} studentIds - Mảng ID của các sinh viên cần xếp lớp.
     * @returns {Promise<object>} - Báo cáo kết quả xếp lớp.
     */
     static async assignStudentsToClasses(subjectId, semester, studentIds) {
        // 1. Tìm tất cả các lớp học phần cho môn học và học kỳ đã cho.
        const classes = await Class.find({ subject: subjectId, semester: semester });
        if (!classes || classes.length === 0) {
            throw new ApiError(404, `No classes found for subject ${subjectId} in semester ${semester}.`);
        }
        const assignedStudents = [];
        const unassignedStudents = [];
        const bulkUpdateOps = []; // Mảng chứa các lệnh cập nhật database

        // 2. Lặp qua từng sinh viên để tìm lớp trống.
        for (const studentId of studentIds) {
            let isAssigned = false;

            // Tìm một lớp còn chỗ trống
            for (const cls of classes) {
                // Kiểm tra xem lớp còn chỗ và sinh viên chưa có trong lớp
                if (cls.students.length < cls.maxSize && !cls.students.includes(studentId)) {
                    // Thêm sinh viên vào lớp (trong bộ nhớ) để cập nhật sĩ số tạm thời
                    cls.students.push(studentId);
                    // Chuẩn bị lệnh cập nhật cho bulk operation
                    bulkUpdateOps.push({
                        updateOne: {
                            filter: { _id: cls._id },
                            update: { $addToSet: { students: studentId } }
                        }
                    });
                    assignedStudents.push(studentId);
                    isAssigned = true;
                    break; // Ngắt vòng lặp, chuyển sang sinh viên tiếp theo
                }
            }

            // Nếu không tìm được lớp nào cho sinh viên này
            if (!isAssigned) {
                unassignedStudents.push(studentId);
            }
        }

        // 3. Thực thi tất cả các lệnh cập nhật vào database một lần duy nhất
        if (bulkUpdateOps.length > 0) {
            await Class.bulkWrite(bulkUpdateOps);
        }

        // 4. Trả về kết quả
        return {
            totalStudentsToAssign: studentIds.length,
            assignedCount: assignedStudents.length,
            unassignedCount: unassignedStudents.length,
            assignedStudents,
            unassignedStudents,
        };
    }
}

module.exports = TimeScheduleService;
