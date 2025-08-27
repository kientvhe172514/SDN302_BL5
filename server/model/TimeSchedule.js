const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeScheduleSchema = new Schema({
    // Lịch này dành cho Lớp học phần nào?
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    // Giáo viên chính phụ trách lịch học này
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    slotNumber: {
        type: Number,
        required: true
    },
    dayOfWeek: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    // SỬA LẠI: Đưa startTime và endTime ra ngoài thành các trường riêng
    startTime: { // Ví dụ: "07:30"
        type: String,
        required: true
    },
    endTime: { // Ví dụ: "09:30"
        type: String,
        required: true
    },
    room: { // Thêm phòng học
        type: String
    }
}, { timestamps: true });

timeScheduleSchema.index({ class: 1, dayOfWeek: 1, slotNumber: 1 }, { unique: true });
module.exports = mongoose.model('TimeSchedule', timeScheduleSchema);