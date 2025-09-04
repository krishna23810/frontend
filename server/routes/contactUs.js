
const routes = require('express').Router();

const {contactUs} = require('../controllers/contactUsHandler');




// Route to send OTP
routes.post('/contact', contactUs);


module.exports = routes;
