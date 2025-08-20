const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistCourseSchema = new Schema({
    // Wishlist của sinh viên nào?
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Mỗi sinh viên chỉ có 1 wishlist
    },
    // Danh sách các môn học mong muốn
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    semester: {
        type: String, // Wishlist cho học kỳ nào
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('WishlistCourse', wishlistCourseSchema);