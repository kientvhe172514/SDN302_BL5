const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    // Liên kết ngược lại với User
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    studentId: { // Dành riêng cho sinh viên
        type: String,
        unique: true,
        sparse: true // Cho phép null là unique, vì teacher không có
    },
    dateOfBirth: {
        type: Date
    },
    phoneNumber: {
        type: String
    },
    avatar: {
        type: String,
        default: 'default-avatar.png'
    }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);