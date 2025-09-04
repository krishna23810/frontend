const mongoose = require('mongoose');
require('dotenv').config();

const profileSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    phoneNumber: {
        type: Number,
        required: false,
        trim: true
    },
    about: {
        type: String,
        required: false,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    address: {
        type: String,
        required: false,
        trim: true
    },
    profilePicture: {
        type: String,
        required: false,
        trim: true
    },
    socialLinks: {
        facebook: {
            type: String,
            required: false,
            trim: true
        },
        twitter: {
            type: String,
            required: false,
            trim: true
        },
        linkedin: {
            type: String,
            required: false,
            trim: true
        }
    }
});

module.exports  = mongoose.model('profileDetails', profileSchema);   



