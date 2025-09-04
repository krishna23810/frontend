const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    accountType: {
        type: String,
        enum: {
            values: ['admin', 'student', 'instructor'],
            message: 'Account type must be admin, student, or instructor'
        },
        required: [true, 'Account type is required']
    },
    additionalInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profileDetails',
        required: false
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses',
        required: false
    }],
    coursesProgress: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'coursesProgress',
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String,
        required: false
    },
    forgotPasswordToken: {
        type: Date,
        required: false
    },
    rating: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingAndReview',
        required: false
    }],
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ accountType: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);   



