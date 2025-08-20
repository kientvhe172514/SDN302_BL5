const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    // Liên kết 1-1 với Profile
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);