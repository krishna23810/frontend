// const razorpay = require('../config/razorpay').instance;
// or 
const { instance } = require('../config/razorpay');
const Course = require('../models/cousrse');
const User = require('../models/user');
const mailSender = require('../utils/mailsender');
const CourseProgress = require('../models/coursesProgress');
const crypto = require('crypto');
const mongoose = require('mongoose');

require('dotenv').config();

// capture payment and raise an order
exports.capturePayment = async (req, res) => {
    //userId and courseId req.user.id
    const userId = req.user.id;
    const { courses } = req.body;
    //validate required fields
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    if (!courses) {
        return res.status(400).json({ message: "Course ID is required" });
    }

    // let course;
    let totalAmount = 0;
    for (const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                });
            }
            // console.log("course", course);
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentEnrolled.includes(uid)) {
                return res.status(400).json({
                    success: false,
                    message: "User already enrolled in this course"
                });
            }
            totalAmount += course.price;
        } catch (error) {
            console.error("Error fetching course:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    //create order
    console.log("total amount:", totalAmount);
    const options = {
        amount: totalAmount * 100, // convert to paisa
        currency: "INR",
        // receipt: `receipt_${userId}_${Date.now()}`,
        receipt: `receipt_${Date.now()}`,
        notes: {
            userId: userId,
            // courseId: courses
        }
    };
    try {
        console.log("Creating order with options:", options);
        const order = await instance.orders.create(options);
        console.log("Order created:", order);
        return res.status(200).json({
            sucess: true,
            message: "Order created successfully",
            courseId: courses,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });



    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create order"
        });
    }
}



// verify payment signature for rozorpay and server

exports.verifyPayment = async (req, res) => {
    console.log("verifyPayment function", req.body);
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    //validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses) {
        return res.status(400).json({
            success: false,
            message: "Payment failed: Missing required fields"
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Payment verified successfully
        // Proceed with enrolling the user in the course
        const enrollmentResult = await enrollUserInCourse(courses, userId);
        
        if (enrollmentResult.success) {
            return res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            return res.status(500).json({
                success: false,
                message: enrollmentResult.message || "Failed to enroll user in courses"
            });
        }
    }
    else {
        // Payment verification failed
        return res.status(400).json({
            success: false,
            message: "Payment verification failed"
        });
    }

}

const enrollUserInCourse = async (courses, userId) => {
    if (!courses || !userId) {
        return {
            success: false,
            message: "Invalid course or user ID"
        };
    }

    try {
        // Enroll the user in each course
        for (const courseId of courses) {
            const course = await Course.findById(courseId);
            const user = await User.findById(userId);

            if (!course) {
                return {
                    success: false,
                    message: "Course not found"
                };
            }
            if (!user) {
                return {
                    success: false,
                    message: "User not found"
                };
            }

            const coursesProgress = new CourseProgress({
                userId,
                courseId,
                // progress: 0 // Initial progress
            });
            await coursesProgress.save();
            
            // Enroll the user in the course
            user.courses.push(course._id);
            user.coursesProgress.push(coursesProgress._id);
            course.studentEnrolled.push(user._id);

            await course.save();
            await user.save();

            const confirmationEmail = await mailSender(
                user.email,
                "Course Enrollment Confirmation",
                `Dear ${user.firstName},\n\nYou have been successfully enrolled in the course: ${course.courseName}.\n\nBest regards,\nYour Learning Platform\nKK tech solutions`
            );
            console.log("Confirmation email sent:", confirmationEmail);
        }

        return {
            success: true,
            message: "User enrolled in courses successfully"
        };
    } catch (error) {
        console.error("Error enrolling user in courses:", error);
        return {
            success: false,
            message: "Failed to enroll user in courses"
        };
    }
}

exports.sendConfirmationEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;
    const userId = req.user.id;
    // Validate the request body
    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const emailResponse = await mailSender(
            user.email,
            "Payment Confirmation",
            `Dear ${user.firstName},\n\nYour payment of ${amount} with payment id ${paymentId} has been successfully processed for order ${orderId}.\n\nBest regards,\nYour Learning Platform`
        );

        console.log("Confirmation email sent:", emailResponse);
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send confirmation email"
        });
    }

    // Send confirmation email logic here
}

// exports.verifySignature = async (req, res) => {
//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
//     // Get the signature from the request headers

//     const signature = req.headers['x-razorpay-signature'];
//     // hash the webhooksecret to match with the signature because once the something hashed or
//     //  encrypted it can't be decrypted or reversed back to its original form

//     //Hmac is a type of cryptographic hash function that uses a secret key to create a hash.
//     // It is used to verify the integrity and authenticity of a message.
//     // it requires the hash algorithm, the secret key, and the message to be hashed.
//     const expectedSignature = crypto.createHmac('sha256', webhookSecret);
//     // convert the expectedSignature to a string and update it with the request body
//     expectedSignature.update(JSON.stringify(req.body));
//     // convert the expectedSignature to a hex string
//     const digest = expectedSignature.digest('hex');

//     // compare the signature with the di
//     if (signature === digest) {
//         console.log("Payment verified successfully");
//         // if the signature matches, then enroll the user in the course
//         const { userId, courseId } = req.body.payload.payment.entity.notes;

//         try {
//             // enroll the user in the course
//             const user = await User.findById(userId);
//             const course = await courses.findById(courseId);
//             // add the course to the user's courses array
//             user.courses.push(course._id);
//             // add the user to the course's studentEnrolled array
//             course.studentEnrolled.push(user._id);
//             // save the user and course
//             await user.save();
//             await course.save();
//             // send response if user and course updation is unsuccessful on save function
//             if (!user || !course) {
//                 return res.status(400).json({ message: "Failed to enroll user in course" });
//             }
//             console.log("User enrolled in course successfully", user.courses, course.studentEnrolled);
//             // send email to the user
//             const conformationEmail = mailSender({
//                 email: user.email,
//                 subject: "Course Enrollment Confirmation",
//                 body: `Dear ${user.firstName},\n\nYou have been successfully enrolled in the course: ${course.courseName}.\n\nBest regards,\nYour Learning Platform`
//             });
//             console.log("Confirmation email sent:", conformationEmail);
//             // return success response
//             return res.status(200).json({
//                 message: "Payment verified and user enrolled in course successfully",
//                 userId: user._id,
//                 courseId: course._id,
//                 courseName: course.courseName
//             });
//         } catch (error) {
//             console.error("Error enrolling user in course:", error);
//             return res.status(500).json({
//                 message: "Failed to enroll user in course"
//             });
//         }
//     }
//     // if the signature do not matches
//     else {
//         console.error("Payment verification failed");
//         return res.status(400).json({ 
//             message: "Payment verification failed" });
//     }
// }

exports.demoCourseRegistration = async (req, res) => {
    // const { userId } = req.user.;
    const userId = req.user.id;
    console.log("userId from req.user", userId);
    const { courseId } = req.body;

    // Validate request body
    if (!userId || !courseId) {
        return res.status(400).json({ message: "User ID and Course ID are required" });
    }

    try {
        // Simulate course registration logic
        console.log(`Registering user ${userId} for demo course ${courseId}`);

        //create user programmatically
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);


        if (!user || !course) {
            return res.status(404).json({ message: "User or Course not found" });
        }

        // create courses progress
        const coursesProgress = new CourseProgress({
            userId,
            courseId,
            // progress: 0 // Initial progress
        });
        await coursesProgress.save();

        console.log("user", user)
        // Enroll user in course
        user.courses.push(course._id);
        user.coursesProgress.push(coursesProgress._id);
        course.studentEnrolled.push(user._id);

        await user.save();
        await course.save();

        // Return success response
        return res.status(200).json({
            message: "Demo course registration successful",
            userId,
            courseId,
            coursesProgressId: coursesProgress._id
        });
    } catch (error) {
        console.error("Error during demo course registration:", error);
        return res.status(500).json({ message: "Failed to register for demo course" });
    }
}

