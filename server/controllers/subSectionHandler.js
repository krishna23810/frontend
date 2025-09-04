const subsections = require('../models/subsections');
const Section = require('../models/section');
const Course = require('../models/cousrse');
const User = require('../models/user');
const {uploadImage} = require('../utils/imageUploder');
require('dotenv').config();

exports.createSubsection = async (req, res) => {
    try {
        const { title, description, duration } = req.body;
        // Support both URL parameters and query parameters
        const sectionId = req.params.sectionId || req.query.sectionId;
        console.log('sectionId', sectionId);
        const videoFile = req.files.videoFile;
        console.log('files',videoFile );
        // Validate section existence
        if (!title || !sectionId || !description || !videoFile || !duration) {
            return res.status(400).json({
                message: 'Please provide all required fields'
            });
        }
        // upload video file to cloudinary
        const videoUrll = await uploadImage(videoFile, process.env.uploadImage_VIDEO_FOLDER);
        console.log('videoUrll', videoUrll);

        //create new subsection
        const newSubsection = await subsections.create({
            title,
            description,
            duration,
            videoUrl: videoUrll.secure_url,
        });
        console.log('newSubsection', newSubsection);
        //update section with new subsection
        const section = await Section.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                message: 'Section not found'
            });
        }
        // Respond with the created subsection and section details
        section.subsections.push(newSubsection._id);
        await section.save();
        //increment subsection count
        const course = await Course.findOne({ sections: sectionId });
        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }
        console.log('course before incrementing totalSubsections:', course.totalSubsections);

        course.totalSubsections += 1;

        console.log('course after incrementing totalSubsections:', course.totalSubsections);
        await course.save();
        //respond with success message
        return res.status(201).json({
            success: true,
            message: 'New subsection created',
            subsection: newSubsection,
            section: section
        });
    } catch (error) {

        console.error('Error creating subsection:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.deleteSubsection = async (req, res) => {
    try {
        // Support both URL parameters and query parameters
        const subsectionId = req.params.subsectionId || req.query.subsectionId;

        // Validate subsection existence
        const subsection = await subsections.findById(subsectionId);
        if (!subsection) {
            return res.status(404).json({ message: 'Subsection not found' });
        }

        // Delete subsection
        await subsections.findByIdAndDelete(subsectionId);

        // Remove subsection from section
        const section = await Section.findOne({ subsections: subsectionId });
        if (section) {
            section.subsections.pull(subsectionId);
            await section.save();
            return res.status(200).json({
                success: true,
                message: 'Subsection deleted successfully'
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Section not found for the subsection'
            });
        }
    } catch (error) {
        console.error('Error deleting subsection:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
exports.updatesubSection = async (req, res) => {
    try {
        const { title, description, duration } = req.body;
        // Support both URL parameters and query parameters
        const subsectionId = req.params.subsectionId || req.query.subsectionId;
        //check file is present or not
        let videoFile = null;
        // videoFile
        if(req.files && req.files.videoFile){
        videoFile = req.files.videoFile;
        }
        
        console.log('videoFile', videoFile);
        console.log('subsectionId', subsectionId);
        console.log('req.body', req.body);

        // Validate subsection existence
        const existingSubsection = await subsections.findById(subsectionId);
        if (!existingSubsection) {
            return res.status(404).json({ message: 'Subsection not found' });
        }

        // Prepare update data
        const updateData = { title: title||existingSubsection.title,
             description: description||existingSubsection.description,
              duration: duration||existingSubsection.duration };

        if (videoFile) {
            // upload video file to cloudinary
            const videoUrll = await uploadImage(videoFile, process.env.CLOUDINARY_VIDEO_FOLDER);
            console.log('videoUrll', videoUrll);
            updateData.videoUrl = videoUrll.secure_url;
        }
        
        // Update the subsection
        const updatedSubsection = await subsections.findByIdAndUpdate(
            subsectionId,
            updateData,
            { new: true }
        );
        
        return res.status(200).json({
            success: true,
            message: 'Subsection updated successfully',
            updatedSubsection
        });

    } catch (error) {   
        console.error('Error updating subsection:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });     
    }
}

// Get all subsections of a section
exports.getSubsections = async (req, res) => {
    try {
        // Support both URL parameters and query parameters
        const sectionId = req.params.sectionId || req.query.sectionId;

        // Validate section existence
        const section = await Section.findById(sectionId).populate('subsections');
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        // Respond with the subsections of the section
        return res.status(200).json({
            message: 'Subsections retrieved successfully',
            subsections: section.subsections
        });
    } catch (error) {
        console.error('Error retrieving subsections:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
