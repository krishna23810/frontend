
const routes = require('express').Router();
const {sendOtp,
    signup,
    login,
    changePassword
} = require('../controllers/auth');

const {resetPasswordToken
    ,updatePassword
}= require('../controllers/forgotPassward');

//middleware to check if user is authenticated
const {isAuthenticated} = require('../middleware/Auth');


// Route to send OTP
routes.post('/sendotp', sendOtp);
// Route to signup
routes.post('/signup', signup);
// Route to login
routes.post('/login', login);
// Route to change password
routes.post('/changepassword', changePassword);

//route to forgot password token
routes.post('/resetpassword-token', resetPasswordToken);

//route to update password
routes.post('/resetpassword', updatePassword);

module.exports = routes;
