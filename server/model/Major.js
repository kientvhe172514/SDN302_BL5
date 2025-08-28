const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const majorSchema = new Schema({
    majorCode: { // Ví dụ: SE, AI, GD
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: { // Ví dụ: Software Engineering
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Major', majorSchema);