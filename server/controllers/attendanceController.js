// controllers/attendanceController.js

const SlotAttendance = require('../model/SlotAttendanceSchema');
const TimeSchedule = require('../model/TimeSchedule');
const Class = require('../model/Class');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Lấy hoặc tạo phiếu điểm danh cho một buổi học (dựa vào timeScheduleId)
 * @route   GET /api/attendance/sheet/:timeScheduleId
 * @access  Private (Teacher)
 */
exports.getOrCreateAttendanceSheet = async (req, res, next) => {
    try {
        const { timeScheduleId } = req.params;

        // Chuẩn hóa ngày về đầu ngày (00:00:00) để truy vấn chính xác
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendanceSheet = await SlotAttendance.findOne({
            timeSchedule: timeScheduleId,
            date: today
        }).populate('attendances.student', 'fullName studentId');

        // Nếu phiếu điểm danh đã tồn tại, trả về ngay
        if (attendanceSheet) {
            return res.status(200).json({
                success: true,
                isNew: false,
                data: attendanceSheet
            });
        }

        // Nếu chưa tồn tại, tiến hành tạo mới
        const schedule = await TimeSchedule.findById(timeScheduleId).populate('class');
        if (!schedule) {
            throw new ApiError(404, 'Lịch học không tồn tại.');
        }

        // Lấy danh sách sinh viên từ lớp học
        const studentList = schedule.class.students;

        // Tạo mảng điểm danh ban đầu
        const initialAttendances = studentList.map(studentId => ({
            student: studentId,
            status: 'not_yet', // Mặc định là chưa điểm danh
            recordUpdatedAt: new Date()
        }));

        // Tạo phiếu điểm danh mới
        let newSheet = await SlotAttendance.create({
            timeSchedule: timeScheduleId,
            date: today,
            attendances: initialAttendances
        });

        // Populate thông tin sinh viên cho phiếu vừa tạo để trả về client
        newSheet = await newSheet.populate('attendances.student', 'fullName studentId');

        res.status(201).json({
            success: true,
            isNew: true,
            data: newSheet
        });

    } catch (error) {
        next(error);
    }
};