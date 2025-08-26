const StudentRegistration = require('../model/StudentRegistration');
class RegistrationService {
    /**
     * Tạo các bản ghi đăng ký môn học cho nhiều sinh viên và nhiều môn học.
     * @param {string[]} studentIds - Mảng ID của sinh viên.
     ** @param {string[]} subjectIds - Mảng ID của môn học.
     * @param {string} semester - Học kỳ.
     * @returns {Promise<object>} - Kết quả của việc tạo.
     */
    static async createRegistrations({ studentIds, subjectIds, semester }) {
        const registrationsToCreate = [];

        // Tạo một mảng chứa tất cả các cặp (sinh viên, môn học) cần tạo
        for (const studentId of studentIds) {
            for (const subjectId of subjectIds) {
                registrationsToCreate.push({
                    student: studentId,
                    subject: subjectId,
                    semester: semester
                });
            }
        }

        if (registrationsToCreate.length === 0) {
            return { success: true, message: "No registrations to create." };
        }

        // Dùng insertMany để thêm tất cả bản ghi một cách hiệu quả.
        // `ordered: false` cho phép tiếp tục chèn ngay cả khi có lỗi trùng lặp.
        try {
            const result = await StudentRegistration.insertMany(registrationsToCreate, { ordered: false });
            return {
                success: true,
                message: `Successfully created ${result.length} new registrations.`,
                data: result
            };
        } catch (error) {
            // Lỗi xảy ra khi có bản ghi bị trùng (đã tồn tại)
            if (error.code === 11000) {
                return {
                    success: true,
                    message: `Created ${error.result.nInserted} new registrations. Some registrations already existed and were skipped.`,
                    data: error.result.insertedIds
                };
            }
            // Lỗi khác
            throw error;
        }
    }
}

module.exports = RegistrationService;