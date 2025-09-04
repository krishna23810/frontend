const express = require('express');
const mailSender = require('../utils/mailsender'); // Adjust the path as necessary
const User = require('../models/user'); // Adjust the path as necessary
const bcrypt = require('bcrypt');

// rather send OTP to email , we can reset password direct link to reset password

//reset password token 

exports.resetPasswordToken = async (req, res) => {
    // Extract email from request body
    const { email } = req.body;
    if (!email) {
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
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found with this email'
        });
    }
    //generate token with expiry time with crypto module
    const crypto = require('crypto');
    const token = crypto.randomUUID();

    // update user with token and expiry time
    const updatedDetails = await User.findOneAndUpdate(
        { email: email },
        {
            token: token,
            forgotPasswordToken: Date.now() + 5 * 60 * 1000 //for 5 minutes
        },
        { new: true })


    //link to reset password
    const url = `http://localhost:3000/reset-password/${token}`;
    // Send email with reset password link
    console.log("token generated sucess next send link to mail");
    try {
        await mailSender(email,
            'Reset Password Link',
            `Click on the link to reset your password: ${url}`);
        return res.status(200).json({
            success: true,
            message: 'Reset password link sent to your email'
        });
    }
    catch (error) {
        console.error('Error sending reset password email:', error);
        return res.status(500).json({
            success: false,
            message: 'Error in sending reset password email'
        });
    }
}

//reset password && update password in db
exports.updatePassword = async (req, res) => {
    try {
        // Extract new password, confirm password, and token from request body
        const { newPassword, conNewPassword, token } = req.body;

        // Validate input
        if (!conNewPassword || !newPassword) {
            return res.status(400).json({ message: 'New password and confirm password are required' });
        }
        if (newPassword !== conNewPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        //check the token in db
        const checktoken = await User.findOne({ token });
        if (!checktoken) {
            console.log("unalbe to find the token in db");
            return res.status(400).json({
                success: false,
                message: 'Error in reset password email please generate another link'
            })
        }
        //check forgotPasswordToken is under time limite or not
        if (checktoken.forgotPasswordToken < Date.now()) {
            console.log("Pasward link time expire");
            return res.status(400).json({
                success: false,
                message: 'Pasward link time expire'
            })
        }
        //hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //update the passward in db 
        checktoken.password = hashedPassword;
        checktoken.token = null; // clear the token after use
        checktoken.forgotPasswordToken = null; // clear the token after use
        await checktoken.save();

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ message: 'Error updating password' });
    }
};