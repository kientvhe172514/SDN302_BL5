const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentRegistrationSchema = new Schema({
    // Sinh viên nào được đăng ký/chỉ định
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Đăng ký/chỉ định cho môn học nào
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    // Trong học kỳ nào
    semester: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Index để đảm bảo một sinh viên không thể đăng ký cùng một môn 2 lần trong 1 học kỳ
studentRegistrationSchema.index({ student: 1, subject: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('StudentRegistration', studentRegistrationSchema);