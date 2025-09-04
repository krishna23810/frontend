# KK TecSolve Backend API

A comprehensive learning platform backend API built with Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Instructor, Student)
  - OTP verification for registration
  - Password reset functionality

- **Course Management**
  - Create, read, update, delete courses
  - Course categorization and tagging
  - Section and subsection management
  - Course enrollment system

- **Payment Integration**
  - Razorpay payment gateway integration
  - Secure payment verification
  - Course purchase and enrollment

- **File Management**
  - Cloudinary integration for image uploads
  - Profile picture management
  - Course thumbnail uploads

- **Rating & Review System**
  - Course ratings and reviews
  - Average rating calculations
  - Review moderation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **Payment**: Razorpay
- **Email**: Nodemailer
- **Logging**: Winston
- **Validation**: Custom validation utilities

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn
- Cloudinary account
- Razorpay account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development
   
   # Database
   DB_URI=mongodb://localhost:27017/kktectsolve
   
   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FOLDER_NAME=your_cloudinary_folder_name
   
   # Razorpay
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_ID=your_email@gmail.com
   EMAIL_PASSWORD=your_email_app_password
   
   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   
   # Logging
   LOG_LEVEL=info
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/v1/auth/send-otp`
Send OTP for user registration
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/v1/auth/signup`
Register a new user
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "accountType": "student",
  "gender": "Male",
  "contactNum": "+1234567890",
  "password": "Password123",
  "confirmPassword": "Password123",
  "otp": "123456"
}
```

#### POST `/api/v1/auth/login`
User login
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

#### POST `/api/v1/auth/change-password`
Change user password (requires authentication)
```json
{
  "oldPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmNewPassword": "NewPassword123"
}
```

### Course Endpoints

#### POST `/api/v1/courses/create-course`
Create a new course (requires instructor authentication)
```json
{
  "courseName": "JavaScript Fundamentals",
  "description": "Learn JavaScript from scratch",
  "price": 999,
  "learnInCourse": "Variables, functions, objects",
  "courseLevel": "beginner",
  "courseDuration": "10 hours",
  "courseType": "paid",
  "category": "Programming",
  "tags": ["javascript", "programming", "web"]
}
```

#### GET `/api/v1/courses/get-all-courses`
Get all published courses

#### GET `/api/v1/courses/get-course/:id`
Get course details by ID

### Payment Endpoints

#### POST `/api/v1/payments/capture-payment`
Create payment order
```json
{
  "courseId": "course_id_here"
}
```

#### POST `/api/v1/payments/verify-signature`
Verify payment signature (webhook)

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting
- Security headers
- Error handling without exposing sensitive information

## 📁 Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── dbconnection.js    # Database connection
│   └── razorpay.js        # Razorpay configuration
├── controllers/           # Route controllers
│   ├── auth.js           # Authentication controller
│   ├── coursesHandler.js # Course management
│   ├── paymentHandler.js # Payment processing
│   └── ...
├── middleware/           # Custom middleware
│   ├── Auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling middleware
├── models/              # Database models
│   ├── user.js          # User model
│   ├── course.js        # Course model
│   └── ...
├── routes/              # API routes
│   ├── userRoutes.js    # User routes
│   ├── coursesRoutes.js # Course routes
│   └── ...
├── utils/               # Utility functions
│   ├── imageUploader.js # Image upload utility
│   ├── mailSender.js    # Email utility
│   ├── validation.js    # Validation utilities
│   └── logger.js        # Logging utility
├── logs/                # Log files (auto-generated)
├── index.js             # Main application file
├── package.json         # Dependencies and scripts
└── README.md           # Project documentation
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📝 Logging

The application uses Winston for logging with the following features:
- File-based logging (error.log, combined.log)
- Console logging in development
- Structured JSON logging
- Log rotation and size limits

## 🚀 Deployment

### Environment Variables for Production
Make sure to set the following environment variables in production:
- `NODE_ENV=production`
- `FRONTEND_URL=https://your-frontend-domain.com`
- Strong `JWT_SECRET`
- Valid database connection string
- All API keys and secrets

### PM2 Deployment
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start index.js --name "kktectsolve-backend"

# Monitor the application
pm2 monit

# View logs
pm2 logs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support, email support@kktectsolve.com or create an issue in the repository.

## 🔄 Recent Updates

- Fixed authentication middleware security issues
- Improved error handling and logging
- Added input validation and sanitization
- Enhanced database models with better validation
- Added comprehensive API documentation
- Implemented proper CORS configuration
- Added security headers and rate limiting 