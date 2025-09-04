 const mongoose = require('mongoose');
 require('dotenv').config();
 
 exports.connectDB = () => {
    const dbURI = process.env.DB_URI;
    mongoose.connect(dbURI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit the process with failure
    });
}
