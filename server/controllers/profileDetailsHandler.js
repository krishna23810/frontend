const profileDetails = require('../models/profileDetails');
const User = require('../models/user');
const Courses = require('../models/cousrse');
const coursesProgress = require('../models/coursesProgress');
const RatingAndReview = require('../models/RatingAndReview');
const { uploadImage } = require('../utils/imageUploder');

exports.updateProfileDetails = async (req, res) => {
    try {
        //get user id from token
        const userId = req.user.id; // Assuming you have middleware to extract user ID from the token and attach it to req.user
        //get profile details form body
        const {
            firstName = "",
            lastName = "",
            gender = "",
            phoneNumber = "",
            about = "",
            dateOfBirth = "",
            address = "",
            socialLinks = {}
        } = req.body;

        // Extract social links with defaults
        const {
            facebook = "",
            twitter = "",
            linkedin = ""
        } = socialLinks;

        //validate required fields
        if (!userId) {
            return res.status(400).json({ message: 'unable to find user id' });
        }

        //find profile details by user id
        const userDetail = await User.findByIdAndUpdate((userId),
            {
                firstName: firstName || userDetail.firstName,
                lastName: lastName || userDetail.lastName,
            }, { new: true }
        ).populate('additionalInfo');
        if (!userDetail) {
            return res.status(404).json({ message: 'User not found' });
        }

        const profileId = userDetail.additionalInfo;
        if (!profileId) {
            return res.status(400).json({ message: 'Profile details not found' });
        }

        //update profile details
        const updatedProfile = await profileDetails.findByIdAndUpdate(
            profileId,
            {
                gender: gender || userDetail.gender,
                phoneNumber: phoneNumber || userDetail.phoneNumber,
                about: about || userDetail.about,
                dateOfBirth: dateOfBirth || userDetail.dateOfBirth,
                address: address || userDetail.address,
                socialLinks: {
                    facebook,
                    twitter,
                    linkedin
                }
            },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        // Update user with new profile details
        userDetail.additionalInfo = updatedProfile;

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: userDetail,
            // profileDetails: updatedProfile
        });

    } catch (error) {

        console.error('Error updating profile details:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error', error: error.message
        });
    }
}

//update user profile photo
exports.updateProfilePicture = async (req, res) => {
    console.log("Updating profile picture");
    try {
        const userId = req.user.id;
        const profilePicture = req.files.image;

        console.log("User ID:", userId);
        console.log("Profile Picture:", profilePicture);
        // Validate input
        if (!userId || !profilePicture) {
            return res.status(400).json({ message: 'User ID and profile picture are required' });
        }

        // Find user and update profile picture
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Upload image to cloud storage (e.g., AWS S3, Cloudinary)
        const result = await uploadImage(profilePicture, process.env.profile_Folde_Name);

        console.log("Cloudinary response:", result);


        const profileId = user.additionalInfo;
        if (!profileId) {
            return res.status(400).json({ message: 'Profile details not found' });

        }
        const updatedProfile = await profileDetails.findByIdAndUpdate(
            profileId,
            { profilePicture: result.secure_url },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            profilePicture: profileId.profilePicture
        });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error', error: error.message
        });
    }
}

//accout delete handler
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have middleware to extract user ID from the token and attach it to req.user

        // Find the user and delete their profile details
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //user can only delete if use is a student
        // if (user.accountType !== 'student') {
        //     return res.status(403).json({ 
        //         message: 'Only students can delete their accounts' });
        // }

        // if user is instructor check if he has courses if yes then he can not delete his account
        //to delete account user must delete all his courses first
        if (user.accountType === 'instructor') {
            const instructor = await User.findById(userId).populate('courses');
            if (instructor.courses.length > 0) {
                return res.status(403).json({
                    message: 'You must delete all your courses before deleting your account'
                });
            }
        }

        // Delete profile details if they exist
        if (user.additionalInfo) {
            await profileDetails.findByIdAndDelete(user.additionalInfo);
            console.log("additionalInfo deleted successfully");
        }
        // Delete courses progress if they exist
        if (user.coursesProgress) {
            await coursesProgress.deleteMany({ userId: user._id });
            console.log("coursesProgress deleted successfully");
        }
        // Delete studentEnrolled from courses if they exist
        if (user.studentEnrolled) {
            await Courses.updateMany(
                { studentsEnrolled: user._id },
                { $pull: { studentsEnrolled: user._id } }
            );
            console.log("studentEnrolled deleted successfully");
        }
        // Delete rating and review if they exist
        if (user.rating) {
            await RatingAndReview.deleteMany({ userId: user._id });
            console.log("rating deleted successfully");
        }
        // Delete the user account

        await User.findByIdAndDelete(user);
        return res.status(200).json({
            success: true,
            message: 'Account deleted successfully'
        });
    }
    catch (err) {
        console.log("geting error while deletion user profile :", err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

// Get profile details handler
exports.getProfileDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming you have middleware to extract user ID from the token and attach it to req.user

        // Find the user and populate their profile details
        const user = await User.findById(userId).populate('additionalInfo').exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: 'Profile details retrieved successfully',
            userData: user
        });
    } catch (error) {
        console.error('Error retrieving profile details:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const courses = user.courses;
        const CoursesProgress = user.coursesProgress;

        const allprogressId = CoursesProgress.map(progress => ( progress.id));

        // console.log("User enrolled courses progress:", CoursesProgress);

        console.log("All progress IDs:", allprogressId);
        
        let allprogressData = [];
        
        const getCourseProgress = async (progressId) => {
            try {
                console.log("Starting getCourseProgress function");
                const course = await coursesProgress.findById(progressId).populate('courseId')
                .populate({path:"courseId", populate:{path:"sections", populate:{path:"subsections"}}});
                console.log("course progress:", course);
                return course;
            } catch (error) {
                console.error("Error getting course progress:", error);
                return null;
            }
        };

        const allprogress = async () => {
            console.log("Starting allprogress function");
            const progressPromises = allprogressId.map(async (progress) => {
                console.log("Processing progress ID:", progress);
                const course = await getCourseProgress(progress);
                if (course) {
                    allprogressData.push({
                        courseId: course.courseId,
                        progress: course.progress,
                        completedLessons: course.completedvideo,
                        // totalLessons: course.totalLessons
                    });
                }
            });
            
            await Promise.all(progressPromises);
            console.log("Completed allprogress function");
        };
        
        await allprogress();

        // console.log("User enrolled courses:", courses);
        // console.log("User courses progress:", coursesProgress);
        console.log("user all enrolled courses :" ,allprogressData);
        return res.status(200).json({
            success: true,
            message: 'Enrolled courses retrieved successfully',
            // courses: user.courses,
            // coursesProgress: user.coursesProgress,
            allprogressData
        });
    } catch (error) {
        console.error('Error retrieving enrolled courses:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


exports.instructorDeshboard = async (req, res) => {
    try {
        const courseDetails = await Courses.find({instructorId: req.user.id });

        const coursesData = courseDetails.map(course => {
            const studentsEnrolled = course.totalStudents;
            const totalAmountGenerated = studentsEnrolled * course.price;

            const courseDataWithStats ={
                _id: course._id,
                courseName: course.courseName,
                // courseDiscription: course.description,
                studentsEnrolled,
                totalAmountGenerated
            }
            return courseDataWithStats;
        });

        return res.status(200).json({
            success: true,
            message: 'Instructor dashboard data retrieved successfully',
            courses: coursesData
        });
    }catch(error) {
        console.error('Error retrieving instructor dashboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
