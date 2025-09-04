const mongoose = require('mongoose');
require('dotenv').config();

const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subsections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subsections',
        required: true
    }]
});

module.exports  = mongoose.model('Section', sectionSchema);   



