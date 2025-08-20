const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    // Đơn của sinh viên nào?
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicationType: {
        type: String,
        enum: ['leave_of_absence', 'course_withdrawal', 'suspension'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    // Người xử lý đơn (Admin/Teacher)
    processedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);