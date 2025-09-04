const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// Auth middleware
exports.isAuthenticated = async (req, res, next) => {
    // Check if token is provided
    // if(req.cookies.token)console.log("Token found in cookies:", req.cookies.token);
    // if(req.body.token)console.log("Token found in body:", req.body.token);
    // if(req.headers.authorization)console.log("Token found in headers:", req.headers.authorization);

    try {
        // Extract token from cookies, body, or headers
        const token = req.cookies.token
            || req.body.token
            ||  req.headers("Authorization").replace('Bearer ', '');

        // Token not found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token, please login again'
            });
        }

        // Check if user still exists in database
        const user = await User.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found, please login again'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token, please login again'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired, please login again'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Student middleware
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Access denied, you are not a student'
            });
        }
        next();
    } catch (error) {
        console.error('Error in student middleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Instructor middleware
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'instructor') {
            return res.status(403).json({
                success: false,
                message: 'Access denied, you are not an instructor'
            });
        }
        next();
    } catch (error) {
        console.error('Error in instructor middleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}

// Admin middleware
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied, you are not an admin'
            });
        }
        next();
    } catch (error) {
        console.error('Error in admin middleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
}
