const mongoose = require('mongoose');
const mailSender = require('../utils/mailsender'); // Adjust the path as necessary

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    otp: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        // expires: '5m' // OTP will expire after 10 minutes
        //or
        expires: 5*60 // 5 minutes in milliseconds
    }
});

 async function sendOTP(email,otp) {
    try {
        await mailSender(email, 'Your OTP Code', `Your OTP code is: ${otp}`);
        console.log('OTP sent successfully to', email);
    }
    catch (error) { 
        console.error('Error sending OTP to', email, ':', error);
        throw new Error('Failed to send OTP: ' + error.message);
    }
 }
 //pre sink to send OTP before saving
otpSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            await sendOTP(this.email, this.otp);
            console.log('OTP sent successfully');
        } catch (error) {
            console.error('Error sending OTP:', error);
            return next(error);
        }
    }
    next();
});

module.exports = mongoose.model('OTP', otpSchema);
