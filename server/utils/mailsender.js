const nodeMailer = require('nodemailer');

const mailSender = async (email, subject, body) => {

    try {
        // Check if environment variables are set
        if (!process.env.EMAIL_HOST || !process.env.EMAIL_ID || !process.env.EMAIL_PASSWORD) {
            throw new Error('Email configuration is missing. Please check your environment variables.');
        }

        const transporter = nodeMailer.createTransport({
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'KK Soltec',
            to: `${email}`,
            subject: subject ,
            html: `<p>${body}</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', email);
        return info;
         
    } catch (error) {
        console.error('Error sending email to', email, ':', error);
        throw error; // Propagate the error so it can be handled by the caller
    }
}
module.exports = mailSender; 
