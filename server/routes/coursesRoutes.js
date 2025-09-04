
const express = require('express');
const routes = require('express').Router();
const fileUpload = require('express-fileupload');

const {createCourse,getAllCourses,updateCourse,getCourseById ,getAllInstructorCourses ,deleteCourse} = require('../controllers/coursesHandler');


const {createCategory,getAllCategory,categoryPageDetail} = require('../controllers/categoryHandler');

const {createSection,deleteSection,updateSection,getSections} = require('../controllers/sectionHandler');

const{createSubsection,deleteSubsection,updatesubSection,getSubsections}= require('../controllers/subSectionHandler');

const {createRating,getAverageRating,getAllRatings,getAllRatingsById} = require('../controllers/ratingandreviewHandler');

const {isAuthenticated, isStudent, isInstructor,isAdmin} = require('../middleware/Auth');

const {viewCourse ,lectureComplete}= require('../controllers/viewCourseHandler');

const {contactUs} = require('../controllers/contactUsHandler');
routes.post('/contact-us', contactUs);


// Route to create a course
routes.post('/createCourse',isAuthenticated,isInstructor, createCourse);
routes.put('/editCourse/:courseId',isAuthenticated,isInstructor, updateCourse);
routes.get('/getAllCourses', getAllCourses);
routes.delete('/deleteCourse/:courseId',isAuthenticated,isInstructor, deleteCourse);

routes.get('/getCourseDetails/:courseId', getCourseById);

routes.get('/view-course/:courseId',isAuthenticated,isStudent, viewCourse);
routes.post('/update-lecture-status', isAuthenticated, isStudent, lectureComplete);

routes.post('/AddSection',isAuthenticated,isInstructor, createSection);
routes.post('/updateSection/:sectionId',isAuthenticated,isInstructor, updateSection);
routes.post('/deleteSection/:sectionId',isAuthenticated,isInstructor, deleteSection);
routes.get('/getSections/:courseID', getSections);

routes.post('/createSubsection/:sectionId',isAuthenticated,isInstructor, createSubsection);
routes.post('/updateSubsection/:subsectionId',isAuthenticated,isInstructor, updatesubSection);
routes.post('/deleteSubsection/:subsectionId',isAuthenticated,isInstructor, deleteSubsection);
routes.get('/getSubsections/:subsectionId', getSubsections);


// route for rating and review
routes.post('/create-rating', isAuthenticated,isStudent, createRating);
routes.get('/get-average-rating/:courseId', getAverageRating);
routes.get('/get-all-ratings/:courseId', getAllRatingsById);
routes.get('/get-all-ratings', getAllRatings);


// Route to create a category
routes.post('/createCategory', isAuthenticated, isAdmin, createCategory);
// Route to get all categories
routes.get('/showAllCategories', getAllCategory);
// Route to get category page detail
routes.post('/categoryPageDetails', categoryPageDetail);

//route to get all courses by Instructor
routes.get('/getAllInstructorCourses', isAuthenticated, isInstructor, getAllInstructorCourses); 


// Export the routes

module.exports = routes;
