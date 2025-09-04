const mongoose = require('mongoose');
require('dotenv').config();

const RatingAndReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: true
    },
    updated :{
        type: String,
        enum : ['Yes', 'No'],
        default: 'No',
        required: true
    }
});

module.exports  = mongoose.model('RatingAndReview', RatingAndReviewSchema);   



