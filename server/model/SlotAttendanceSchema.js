const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlotAttendanceSchema = new Schema({
    // Buổi điểm danh này của slot (lịch học) nào?
    timeSchedule: {
        type: Schema.Types.ObjectId,
        ref: 'TimeSchedule',
        required: true
    },
    // Ngày diễn ra buổi điểm danh
    date: {
        type: Date,
        required: true
    },
    // Mảng điểm danh của từng sinh viên trong buổi học này
    attendances: [{
        _id: false, // Quan trọng: không tạo ObjectId thừa cho mỗi sinh viên
        student: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'not_yet'],
            default: 'not_yet'
        },
        // Ghi lại thời gian khi trạng thái của RIÊNG sinh viên này được cập nhật
        recordUpdatedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    // Timestamps này (createdAt, updatedAt) là dành cho CẢ buổi học
    timestamps: true
});

// Đảm bảo mỗi buổi học (slot + ngày) chỉ có MỘT bảng điểm danh duy nhất
SlotAttendanceSchema.index({ timeSchedule: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('SlotAttendance', SlotAttendanceSchema);