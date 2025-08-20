const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    // Feedback cho lớp học nào?
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    // Feedback từ sinh viên nào?
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Feedback cho giáo viên nào?
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String
    }
}, { timestamps: true });

// Đảm bảo mỗi sinh viên chỉ feedback 1 lần cho 1 lớp học
feedbackSchema.index({ class: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);