const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const coursesRoutes = require('./routes/coursesRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactUs');

// Import utilities
const { connectDB } = require('./config/dbconnection');
const { uploadImage } = require('./utils/imageUploder');
// const { logInfo, logError } = require('./utils/logger');



const PORT = process.env.PORT || 4000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
// Add this after the existing middleware
app.use(express.static(path.join(__dirname, '../build')));

// Add this as the last route (catch-all for React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});


// CORS configuration
// app.use(cors({
//     origin:'http://localhost:3000', // Adjust this to your frontend URL
//     credentials: true,
// }));
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));


// File upload middleware
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    // limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    // abortOnLimit: true
}));

// Cloudinary configuration
uploadImage();


// Routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/course', coursesRoutes);
app.use('/api/v1/about', contactRoutes);

// Home route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the KKTecSolve API',
        version: '1.0.0',
        documentation: '/api/v1/docs'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
