const mongoose = require('mongoose');
require('dotenv').config();

const coursesSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: [true, 'Course name is required'],
        trim: true,
        minlength: [3, 'Course name must be at least 3 characters long'],
        maxlength: [100, 'Course name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    image: {
        type: String,
        required: [true, 'Course image is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Course price is required'],
        min: [0, 'Price cannot be negative']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Instructor ID is required']
    },
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: false
    }],
    learnInCourse: {
        type: String,
        required: false,
        trim: true
    },
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingAndReview',
        required: false
    }],
    courseType: {
        type: String,
        enum: {
            values: ['free', 'paid'],
            message: 'Course type must be free or paid'
        },
        default: 'free'
    },
    courseDuration: {
        type: String,
        required: false,
        trim: true
    },
    courseLevel: {
        type: String,
        enum: {
            values: ['beginner', 'intermediate', 'advanced'],
            message: 'Course level must be beginner, intermediate, or advanced'
        },
        required: [true, 'Course level is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: [true, 'Category is required']
    },
    tags: [{
        type: String,
        required: false,
        trim: true
    }],
    studentEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    status: {
        type: String,
        enum: {
            values: ['Draft', 'Published'],
            message: 'Status must be Draft or Published'
        },
        default: 'Draft'
    },
    totalStudents: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    totalSubsections: {
        type: Number,
        default: 0
    }

},
    {
        timestamps: true
    });

// Indexes for better query performance
coursesSchema.index({ courseName: 'text', description: 'text' });
coursesSchema.index({ instructorId: 1 });
coursesSchema.index({ category: 1 });
coursesSchema.index({ courseType: 1 });
coursesSchema.index({ courseLevel: 1 });
coursesSchema.index({ status: 1 });
coursesSchema.index({ createdAt: -1 });

// Virtual for enrollment count
coursesSchema.virtual('enrollmentCount').get(function () {
    return this.studentEnrolled ? this.studentEnrolled.length : 0;
});

// Virtual for section count
coursesSchema.virtual('sectionCount').get(function () {
    return this.sections ? this.sections.length : 0;
});

// Ensure virtual fields are serialized
coursesSchema.set('toJSON', { virtuals: true });
coursesSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Courses', coursesSchema);



