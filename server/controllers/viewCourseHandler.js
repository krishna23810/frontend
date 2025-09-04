
const Course = require('../models/cousrse');
// const User = require('../models/user');
const CoursesProgress = require('../models/coursesProgress');
const subsections = require('../models/subsections');

require('dotenv').config();


exports.viewCourse = async (req, res) => {

    const { courseId } = req.params;
    const userId = req.user._id;
    console.log("courseId:", courseId);
    console.log("userId:", userId);
    try {
        const course = await Course.findById(courseId)
            .populate({ path: 'sections', populate: { path: 'subsections' } });


        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const progress = await CoursesProgress.findOne({ courseId, userId }).populate('completedvideo');
        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Course progress not found'
            });
        }

       return res.status(200).json({
            success: true,
            message: 'View Course fetched successfully',
            course,
            progress
        });

    } catch (error) {
        console.error('Error fetching course:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });     
    }
}


exports.lectureComplete = async (req, res) => {
    const { courseId, subSectionId } = req.body;
    const userId = req.user.id;

    try {
        const subsection = await subsections.findById(subSectionId);
        if (!subsection) {
            return res.status(404).json({
                success: false,
                message: 'Subsection not found'
            });
        }

        // Update the course progress
        const progress = await CoursesProgress.findOne(
            { courseId, userId }
        ).populate('courseId');

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: 'Course progress not found'
            });
        }
        else{

            //check if the lecture is already completed
            if (progress.completedvideo.includes(subSectionId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Lecture already completed'
                });
            }

            // Mark the lecture as completed
            progress.completedvideo.push(subSectionId);
            const progressPercentage = (progress.completedvideo.length / progress.courseId.totalSubsections) * 100;
            console.log("progressPercentage", progressPercentage);
            progress.progress = progressPercentage;
            progress.status = 'in-progress';
            if (progress.progress === 100) {
                progress.completionDate = Date.now();
                progress.status = 'completed';
            }
            await progress.save();

        }
        return res.status(200).json({
            success: true,
            message: 'Lecture marked as complete',
            progress
        });

    } catch (error) {
        console.error('Error marking lecture as complete:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}