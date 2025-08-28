const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    roomName: {
        type: String,
        required: true,
        trim: true
    },
    building: {
        type: String,
        required: true,
        trim: true
    },
    floor: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    roomType: {
        type: String,
        enum: ['classroom', 'lab', 'seminar', 'auditorium', 'computer_lab'],
        default: 'classroom'
    },
    facilities: [{
        type: String,
        enum: ['projector', 'computer', 'whiteboard', 'air_conditioning', 'microphone', 'speakers']
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        trim: true
    }
}, { 
    timestamps: true 
});

// Index để tối ưu tìm kiếm
roomSchema.index({ building: 1, floor: 1 });
roomSchema.index({ roomCode: 1 });
roomSchema.index({ isActive: 1 });

module.exports = mongoose.model('Room', roomSchema);