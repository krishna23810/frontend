const Section = require('../models/section');
const course = require('../models/cousrse');
const User = require('../models/user');

exports.createSection = async (req, res) => {
    try {
        const { title, courseId } = req.body;

        // Validate course existence
        if (!title || !courseId) {
            return res.status(404).json({
                message: 'please provide title and courseId'
            });
        }

        // Create new section
        const newSection = await Section.create({ title });

        // update course with new section
        const coursee = await course.findByIdAndUpdate((courseId), {
            $push: { sections: newSection._id }
        }, { new: true }).populate('sections')
            .populate({
                path: 'sections',
                populate: {
                    path: 'subsections'
                }
            }
            ).exec();
        return res.status(201).json({
            success: true,
            message: 'Section created successfully',
            section: coursee,
        });

    } catch (error) {
        console.error('Error creating section:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.deleteSection = async (req, res) => {
    try {
        // Extract sectionId from request parameters
        console.log('request params:', req.params);
        console.log('request body:', req.body);
        const sectionId = req.params.sectionId;
        
        // Validate section existence
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Find course containing this section
        const coursee = await course.findOne({ sections: sectionId });
        if (coursee) {
            // Remove section from course
            coursee.sections.pull(sectionId);
            await coursee.save();
        }

        // Delete section from database
        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({ 
            success: true,
            message: 'Section deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting section:', error);
        return res.status(500).json({
            success: false,
             message: 'Internal server error' });
    }
}

exports.updateSection = async (req, res) => {
    // console.log("Updating section with data:", req.body);
    try {
        const sectionId = req.params.sectionId;
        const { title } = req.body;
        console.log('sectionId:', sectionId, 'title:', title);
        // Validate section existence
        const section = await Section.findById(sectionId);
        if (!section || !title) {
            return res.status(404).json({ message: 'Section not found or title not provided' });
        }

        // Update section
        section.title = title || section.title;
        await section.save();
        return res.status(200).json({
            success: true,
            message: 'Section updated successfully', section
        });
    } catch (error) {
        console.error('Error updating section:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Get all sections of a course
exports.getSections = async (req, res) => {
    try {
        const courseId = req.params.courseID;

        // Validate course existence
        const coursee = await course.findById(courseId).populate('sections');
        if (!coursee) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Return sections of the course
        return res.status(200).json({
            success: true,
            message: 'Sections retrieved successfully',
            sections: coursee.sections,
        });
    } catch (error) {
        console.error('Error retrieving sections:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error' });
    }
}
