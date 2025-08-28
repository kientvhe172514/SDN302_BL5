const StudentRegistration = require('../model/StudentRegistration');
// Import service chứa logic xếp lớp
const TimeScheduleService = require('./TimeScheduleService'); 

class RegistrationService {
    /**
     * Tạo các bản ghi đăng ký và ngay lập tức xếp lớp cho sinh viên.
     */
    static async createRegistrationsAndAssignClasses({ studentIds, subjectIds, semester }) {
        // --- BƯỚC 1: GÁN MÔN HỌC (TẠO CÁC BẢN GHI ĐĂNG KÝ) ---
        const registrationsToCreate = [];
        for (const studentId of studentIds) {
            for (const subjectId of subjectIds) {
                registrationsToCreate.push({
                    student: studentId,
                    subject: subjectId,
                    semester: semester
                });
            }
        }
        //check sinh vien ngành nào và kỳ nào thì mới được đăng ký học phần của ngành đó và kỳ đó
        if (registrationsToCreate.length === 0) {
            return { success: true, message: "No registrations to create." };
        }
        let registrationResult;
        try {
            // Dùng insertMany để thêm tất cả bản ghi một cách hiệu quả.
            // `ordered: false` cho phép tiếp tục chèn ngay cả khi có lỗi trùng lặp.
            const result = await StudentRegistration.insertMany(registrationsToCreate, { ordered: false });
            registrationResult = {
                success: true,
                message: `Successfully created ${result.length} new registrations.`
            };
        } catch (error) {
            // Lỗi xảy ra khi có bản ghi bị trùng (đã tồn tại)
            if (error.code === 11000) {
                registrationResult = {
                    success: true,
                    message: `Created ${error.result.nInserted} new registrations. Some registrations already existed and were skipped.`
                };
            } else {
                // Lỗi khác
                throw error;
            }
        }

        // --- BƯỚC 2: TỰ ĐỘNG XẾP LỚP CHO CÁC MÔN VỪA ĐƯỢC GÁN ---
        const assignmentReports = [];
        // Lặp qua từng môn học đã được gán
        for (const subjectId of subjectIds) {
            try {
                // Với mỗi môn, gọi hàm xếp lớp với danh sách sinh viên tương ứng
                const report = await TimeScheduleService.assignStudentsToClasses(subjectId, semester, studentIds);
                assignmentReports.push({
                    subjectId,
                    status: 'Success',
                    details: report
                });
            } catch (error) {
                // Nếu có lỗi khi xếp lớp cho một môn (ví dụ: hết chỗ), ghi nhận lại và tiếp tục
                assignmentReports.push({
                    subjectId,
                    status: 'Failed',
                    error: error.message
                });
            }
        }

        // --- BƯỚC 3: TRẢ VỀ BÁO CÁO TỔNG HỢP ---
        return {
            registrationResult,
            assignmentResult: {
                message: "Class assignment process finished.",
                reports: assignmentReports
            }
        };
    }
}

// File service chỉ nên export chính nó, không import chính nó.
module.exports = RegistrationService;