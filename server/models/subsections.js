const mongoose = require('mongoose');
require('dotenv').config();

const subsectionsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    videoUrl: {
        type: String,
        required: false,
        trim: true
    },
    duration: {
        type: String,
        required: false,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
        }
});

module.exports  = mongoose.model('subsections', subsectionsSchema);   



