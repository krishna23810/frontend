const mongoose = require('mongoose');
require('dotenv').config();

const coursesProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    completedvideo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subsections'
        }
    ],
    progress: {
        type: Number,
        required: true,
        default: 0 // Default progress is 0%
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    // Add more fields as needed

    status: {
        type: String,
        enum: ['in-progress', 'completed', 'not-started'],
        default: 'not-started'
    },

    completionDate: {
        type: Date,
        required: false
    }
});

module.exports  = mongoose.model('coursesProgress', coursesProgressSchema);   



