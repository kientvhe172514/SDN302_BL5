const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    originalName: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

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
    documents: [documentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);