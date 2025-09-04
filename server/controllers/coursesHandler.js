const courses = require('../models/cousrse');
const { populate } = require('../models/RatingAndReview');
const category = require('../models/category');
const User = require('../models/user');
const { uploadImage } = require('../utils/imageUploder');


// Create a course handler
exports.createCourse = async (req, res) => {
    try {
        const { courseName, description, price, learnInCourse,
            courseLevel, courseDuration, courseType, categoryID, tags } = req.body;
        //thumbnail image upload
        console.log("req.file", req.files);
        console.log("req.body", req.body);
        if (!req.files.image) {
            return res.status(400).json({
                success: false,
                message: 'Thumbnail image is required'
            });
        }
        const courseImage = req.files.image; // Assuming the image path is stored in req.file.path

        const userId = req.user._id; // Assuming user ID is available in req.user

        //find category id from category name
        const existingCategory = await category.findOne({ _id: categoryID });

        const result = await uploadImage(courseImage, process.env.CLOUDINARY_COURSE_THUMBNAIL_FOLDER);

        const newCourse = new courses({
            courseName,
            description,
            image: result.secure_url, // Assuming the image URL is stored in result.secure_url 
            price,
            learnInCourse,
            instructorId: userId,
            courseLevel,
            courseDuration,
            courseType,
            category: existingCategory._id, // Use the found category ID
            tags // Assuming tags is an array of tag IDs
        });
        // Save the course to the database
        await newCourse.save();

        //add courseId to instructor
        await User.findByIdAndUpdate(
            userId,
            { $push: { courses: newCourse._id } },
            { new: true }
        );
        console.log("Instructor updated with new course");

        //add courseId to category
        await category.findByIdAndUpdate(
            existingCategory._id,
            { $push: { courseId: newCourse._id } },
            { new: true }
        );
        console.log("Course created successfully:", newCourse);
        return res.status(201).json({
            success: true,
            message: 'Course created successfully',
            course: newCourse
        });

    } catch (error) {
        console.error('Error creating course:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

//update course handler
exports.updateCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseName, description, price, learnInCourse, status,
            courseLevel, courseDuration, courseType, categoryID, tags } = req.body;
        console.log("body : ",req.body);
        // Parse tags if it's a string
        let parsedTags = tags;
        if (typeof tags === 'string') {
            try {
                parsedTags = JSON.parse(tags);
            } catch (error) {
                parsedTags = tags;
            }
        }
        // console.log("status:", req.body.formData.status);


        const course = await courses.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        let courseImage;
        if (req.files && req.files.image) {
            courseImage = req.files.image;
            const result = await uploadImage(courseImage, process.env.CLOUDINARY_COURSE_THUMBNAIL_FOLDER);
            course.image = result.secure_url; // Update course image URL
        }
        // Update the course details
        course.courseName = courseName || course.courseName;
        course.description = description || course.description;
        course.price = price || course.price;
        course.learnInCourse = learnInCourse || course.learnInCourse;
        course.courseLevel = courseLevel || course.courseLevel;
        course.courseDuration = courseDuration || course.courseDuration;
        course.courseType = courseType || course.courseType;
        course.tags = parsedTags || course.tags; // Update tags if provided
        course.status = status || course.status; // Update status if provided


        // Update category if provided
        if (categoryID) {
            const existingCategory = await category.findById(categoryID);
            if (existingCategory) {
                course.category = existingCategory._id; // Use the found category ID
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }
        }

        // Update tags if provided
        if (parsedTags) {
            course.tags = parsedTags; // Assuming tags is an array of tag IDs
        }

        // Save the updated course
        await course.save();

        return res.status(200).json({
            success: true,
            message: 'Course updated successfully',
            course
        });

    } catch (error) {
        console.error('Error updating course:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


// get all courses handler
exports.getAllCourses = async (req, res) => {
    try {
        const coursesList = await courses.find()
            .populate('instructorId', 'firstName lastName email') // Populate instructor details
            .populate('sections.subsections') // Populate sections and subsections if needed
            .populate('category'); // Populate category details

        return res.status(200).json({
            success: true,
            message: 'Courses retrieved successfully',
            courses: coursesList
        });
    } catch (error) {
        console.error('Error retrieving courses:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

//get course all detail by id handler
exports.getCourseById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await courses.findById(courseId)
            .populate({
                path: 'instructorId',
                select: 'firstName lastName email ',
                populate: {
                    path: 'additionalInfo',
                    select: 'profilePicture' // Populate additional info if needed
                }
            }) // Populate instructor details
            .populate({
                path: 'sections',
                populate: {
                    path: 'subsections'
                }
            }) // Populate sections if needed
            .populate('ratingAndReviews') // Populate ratings and reviews if needed
            .populate('category') // Populate category details
            .populate('studentEnrolled') // Populate enrolled students if needed
            .exec();

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Course retrieved successfully',
            course
        });
    } catch (error) {
        console.error('Error retrieving course:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.getAllInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id; // Get the instructor ID from the authenticated user
        // we have to populate course which is under user , category which is under course , sections which is under course , and subsections which is under sections
        const allCourses = await User.findById(instructorId).populate('courses')
            .populate({
                path: 'courses',
                populate: {
                    path: 'sections',
                    populate: {
                        path: 'subsections'
                    }
                }
            }) // Populate sections if needed
            // .populate('ratingAndReviews') // Populate ratings and reviews if needed
            // .populate('category') // Populate category details
            // .populate('studentEnrolled') // Populate enrolled students if needed
            .exec();
        const coursesList = allCourses.courses;

        return res.status(200).json({
            success: true,
            message: 'Instructor courses retrieved successfully',
            courses: coursesList
        });
    } catch (error) {
        console.error('Error retrieving instructor courses:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const deletedCourse = await courses.findById(courseId).populate("studentEnrolled").exec();

        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }
        if(deletedCourse.studentEnrolled.length > 0 || deletedCourse.totalStudents > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete course with enrolled students'
            });
        }
        // Delete the course
        await courses.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: 'Course deleted successfully',
            course: deletedCourse
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};