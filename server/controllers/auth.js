const express = require('express');
const User = require('../models/user');
const OTP = require('../models/otp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const ProfileDetails = require('../models/profileDetails');
const mailSender = require('../utils/mailsender');
const uploadImage = require('../utils/imageUploder');
require('dotenv').config();
//send opt

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    //check valid email
    if (!email || !email.includes('@') || !email.includes('.')) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email'
        });
    }
    try {
        const checkuser = await User.findOne({ email });
        if (checkuser) {
            return res.status(400).json({
                success: false,
                message: 'User already ,,exists'
            }); ``
        }
        let otp = otpGenerator.generate(6, {
            upperCase: false,
            specialChars: false,
            alphabets: false
        });
        console.log("otp generated ", otp);
        checkuniqueOtp = await OTP.findOne({ otp: otp });
        console.log("check unique otp", checkuniqueOtp);
        // Check if the generated OTP is unique
        // If not, generate a new one until a unique OTP is found
        while (checkuniqueOtp) {
            otp = otpGenerator.generate(6, {
                upperCase: false,
                specialChars: false,
                alphabets: false
            });
            checkuniqueOtp = await OTP.findOne({ otp: otp });
            console.log("new otp generated ", otp);
        }

        const newOtp = new OTP({ email, otp });

        console.log("new otp created", newOtp);
        await newOtp.save();

        console.log("OTP saved to database", newOtp);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp: otp // Return the OTP in the response (optional, for testing purposes)
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}


//singup
exports.signup = async (req, res) => {
    try {
        const { email, firstname, lastname, accountType, gender,
            contactNum, password, confirmPassword, otp } = req.body;

        // Validate input
        if (!email || !password || !otp || !confirmPassword || !firstname || !lastname || !contactNum) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        // Check if the email is valid
        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        // Check if the password and confirm password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and confirm password do not match'
            });
        }
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }//finf most recent OTP
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);

        console.log("recent otp", recentOtp);
        // Check if an OTP was sent to the email
        if (!recentOtp) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found for this email'
            });
        } else if (recentOtp.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }
        let image;
        if (gender === 'Male') {
            const maleSampleImage = ['Destiny', 'Valentina', 'Andrea', 'Jade', 'Kimberly', 'Aaliyah', 'Jade'];
            const randomIndex = Math.floor(Math.random() * maleSampleImage.length);
            // var image = `https://api.dicebear.com/5.x/avataaars/svg?seed=${maleSampleImage[randomIndex]}&backgroundColor=transparent`;
            image = `https://api.dicebear.com/9.x/notionists/svg?seed=${maleSampleImage[randomIndex]}`;
        }
        if (gender === 'Female') {
            const maleSampleImage = ['Leah', 'Brian', 'Aiden', 'Amaya', 'Luis', 'Mackenzie'];
            const randomIndex = Math.floor(Math.random() * maleSampleImage.length);
            // var image = `https://api.dicebear.com/5.x/avataaars/svg?seed=${maleSampleImage[randomIndex]}&backgroundColor=transparent`;
            image = `https://api.dicebear.com/9.x/notionists/svg?seed=${maleSampleImage[randomIndex]}`;
        } else {
            const maleSampleImage = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Leah', 'Brian', 'Aiden', 'Amaya'];
            const randomIndex = Math.floor(Math.random() * maleSampleImage.length);
            // var image = `https://api.dicebear.com/5.x/avataaars/svg?seed=${maleSampleImage[randomIndex]}&backgroundColor=transparent`;
            image = `https://api.dicebear.com/9.x/notionists/svg?seed=${maleSampleImage[randomIndex]}`;
        }
        console.log("image", image);
        
        const profilePictureUrl = image;
        console.log("profile picture URL", profilePictureUrl);
        //create profile details
        const profileDetails = new ProfileDetails({
            // userId: null, // This will be set after user creation
            gender: gender,
            phoneNumber: contactNum,
            about: null,
            dateOfBirth: null,
            address: null,
            profilePicture: profilePictureUrl,
            socialLinks: {
                facebook: null,
                twitter: null,
                linkedin: null
            },

        });
        // save profile details
        await profileDetails.save();
        console.log("profile details created", profileDetails);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashed password", hashedPassword);

        const newUser = new User({
            firstName: firstname, lastName: lastname, email, password: hashedPassword,
            accountType, additionalInfo: profileDetails._id,
        });
        await newUser.save();
        //mail send for success full rigistration

        console.log("new user created", newUser);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            newUser,
        });
    }
    catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

//login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        // Check if the email is valid
        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }
        // Check if the user exists
        const user = await User.findOne({ email }).populate('additionalInfo');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Check if the password is correct
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }
        //palyload for JWT
        const palyload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType,
        }
        // Generate JWT token
        let token = jwt.sign(palyload, process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        user.token = token; // Add token to the user object
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });
        user.password = undefined; // Remove password from the user object
        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production

            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
        });
        // await user.token.save();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user,
            token
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}
//change password
exports.changePassword = async (req, res) => {
    // Get the data from the request body
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    //fetch the email from the token
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        // Validate input
        console.log("data check validation", oldPassword, newPassword, confirmNewPassword);
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        console.log("data check validation pass");
        console.log(decoded, token);
        // Check if the new password and confirm new password match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirm new password do not match'
            });
        }
        console.log("new password and confirm new password match");
        // Find the user by email and check the old password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        console.log("user found");
        // Removed logging of user.password for security reasons
        console.log("checking old password");

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Old password is incorrect'
            });
        }
        console.log("old password is correct");
        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in db
        user.password = hashedNewPassword;
        console.log("new password hashed", user.password);
        await user.save();
        console.log("password updated successfully");
        mailSender(email, 'Password Changed Successfully', 'Your password has been changed successfully. If you did not request this change, please contact support immediately.');
        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
        //seng email to user
    } catch (error) {
        console.error("Error during changing password:", error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}


