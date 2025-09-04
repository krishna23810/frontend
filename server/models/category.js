const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
        trim: true
    },
    courseId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: false
    }]
});

module.exports = mongoose.model('category', categorySchema);
// This model defines a Tag schema with a single field 'name' which is required and trimmed.