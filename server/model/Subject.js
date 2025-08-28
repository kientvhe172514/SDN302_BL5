const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    subjectCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    credits: {
        type: Number,
        required: true,
        min: 1
    },
    semester: {
        type: Number, // Môn này thường được dạy ở kỳ thứ mấy?
        required: true,
        min: 1
    },
    major: {
        type: Schema.Types.ObjectId,
        ref: 'Major' // Tham chiếu đến model Ngành học
    },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);