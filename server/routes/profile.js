

const {updateProfileDetails,deleteAccount,getProfileDetails ,updateProfilePicture ,getEnrolledCourses,instructorDeshboard} = require('../controllers/profileDetailsHandler');

//middleware to check if user is authenticated
const {isAuthenticated} = require('../middleware/Auth');

const Routes = require('express').Router();

// creating routes
Routes.put('/updateProfile', isAuthenticated, updateProfileDetails);
Routes.put('/updateDisplayPicture', isAuthenticated, updateProfilePicture);
Routes.delete('/deleteAccount', isAuthenticated, deleteAccount);
Routes.get('/getUserDetails', isAuthenticated, getProfileDetails);

Routes.get('/instructorDashboard', isAuthenticated, instructorDeshboard);

Routes.get('/getUserEnrolledCourses', isAuthenticated, getEnrolledCourses);

// Exporting the profile routes
module.exports = Routes;
