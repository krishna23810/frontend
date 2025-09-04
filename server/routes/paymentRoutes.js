
const {capturePayment,verifyPayment, sendConfirmationEmail,demoCourseRegistration} = require('../controllers/paymentHandler');

const {isAuthenticated,isStudent} = require('../middleware/Auth');
const routes = require('express').Router();

// Route to capture payment
routes.post('/capture-payment', isAuthenticated,isStudent, capturePayment);

// Route to verify payment signature
routes.post('/verify-signature', isAuthenticated, isStudent,verifyPayment);
// Export the payment routes



routes.post('/send-confirmation-email', isAuthenticated, isStudent,sendConfirmationEmail);
// demo course registration
routes.post('/demo-course-registration', isAuthenticated, demoCourseRegistration);
module.exports = routes;