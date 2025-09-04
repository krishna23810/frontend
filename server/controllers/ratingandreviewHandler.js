const mongoose = require('mongoose');
const RatingAndReview = require('../models/RatingAndReview');
const User = require('../models/user');

const Courses = require('../models/cousrse');

//create rating
exports.createRating = async (req, res) => {
    //get data 
    console.log("Request Body:", req.body);
    const { rating, review, courseId } = req.body;
    const userId = req.user._id;

    try {//check user is enrolled in course

        const courseenroll = await Courses.findOne({
            _id: courseId,
            studentEnrolled: { $elemMatch: { $eq: userId } }
        });

        if (!courseenroll) {
            return res.status(400).json({
                success: false,
                message: 'You must be enrolled in the course to rate and review it'
            });
        }
        // checking user in Rating And Review
        const checkUser = await RatingAndReview.findOne({
            userId: userId,
            course: courseId
        });
        console.log("Check User:", checkUser);
         const result = await RatingAndReview.aggregate([
            {
                $match: {
                    //convertin to object id
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 }
                }
            }
        ]);
        // const average = {

        // }
        console.log("Aggregation Result:", result);

        if (checkUser) {
            //update the rating and review
            const updatedRating = await RatingAndReview.findByIdAndUpdate(
                checkUser._id,
                {
                    rating: rating,
                    review: review.trim(),
                    updated: 'Yes'
                },
                { new: true });
            //update the course rating
            const course = await Courses.findByIdAndUpdate(
                courseId,
                {
                    $set: {
                        averageRating: result[0].averageRating,
                        totalRatings: result[0].totalRatings
                    }
                },
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: 'Rating and review updated successfully',
                data: updatedRating,
                updated_course: course
            });
        }
        //create new rating and review
        console.log("Creating new rating and review");
        const newRating = new RatingAndReview({
            rating: rating,
            review: review.trim(),
            userId: userId,
            course: courseId,
            updated: 'No'
        });
        const savedRating = await newRating.save();
        console.log("Saved Rating:", savedRating);

        //add rating to course
        const course = await Courses.findByIdAndUpdate(
            courseId,
            { $push: { ratingAndReviews: savedRating._id },
              $set: {
                  averageRating: result[0] ? result[0].averageRating : rating,
                  totalRatings: result[0] ? result[0].totalRatings : 1
              }
         },
            { new: true }
        ).populate('ratingAndReviews').exec();
        console.log("Updated Course:", course);

        //add rating to user
        await User.findByIdAndUpdate(
            userId,
            { $push: { rating: savedRating._id } },
            { new: true }
        );
        console.log("User updated with rating:", userId);
        return res.status(200).json({
            success: true,
            message: 'Rating and review created successfully',
            data: savedRating
        });

    } catch (error) {
        console.error('Error creating rating and review:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }

}
// get average rating
exports.getAverageRating = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        // calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    //convertin to object id
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);
        if (result.length === 0) {
            // if no ratings found return 0
            return res.status(404).json({
                success: false,
                message: 'No ratings and reviews average found for this course',
                averageRating: 0,
                totalReviews: 0
            });
        }

        // return average rating and total reviews
        return res.status(200).json({
            success: true,
            message: 'ratings and reviews average fetched successfully',
            avwrageRating: result[0].averageRating,
            totalReviews: result[0].totalReviews
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}



//get all ratings for a course
exports.getAllRatingsById = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const ratings = await RatingAndReview.find({ course: courseId })
            .populate(
                {
                    // get name from user
                    path: 'userId',
                    select: 'firstName lastName email', // Select the fields you want to return
                    populate: {
                        path: 'additionalInfo',
                        select: 'profilePicture'
                    }
                })
            .populate(
                {
                    path: 'course',
                    select: 'courseName' // Select the fields you want to return
                })
            .sort({ rating: "desc" })
            .exec(); // Sort by rating in descending order

        if (ratings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No ratings found for this course'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Ratings retrieved successfully',
            ratings: ratings
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

//get all ratings
exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await RatingAndReview.find({})
            .sort({ rating: 'desc' })
            .populate({
                path: 'userId',
                select: 'firstName lastName email',
                populate: {
                    path: 'additionalInfo',
                    select: 'profilePicture'
                }
            })
            .populate({
                path: 'course',
                select: 'courseName'
            })
            .exec();
        // Check if ratings exist
        if (ratings.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No ratings found'
            });
        }
        // console.log("Ratings:", ratings);
        // const courses = await Courses.find({ _id: { $in: ratings.map(r => r.courseId) } });
        return res.status(200).json({
            success: true,
            message: 'Ratings retrieved successfully',
            ratings: ratings,
            // courses: courses
        });
    }
    catch (error) {
        console.error('Error fetching all ratings:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};