const mailSender = require('../utils/mailsender');
require('dotenv').config();

exports.contactUs = async (req, res) => {
    try {
        const { firstName, lastName, mphone, email, message } = req.body;

        // validate
        if (!firstName || !lastName || !mphone || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // send email to user
        const emailToUser = mailSender(
             email,
            'Contact Us Form Submission',
            `Hello ${firstName} ${lastName},<br><br>Thank you for reaching out to us. We have received your message:<br><br>${message}<br><br>We will get back to you shortly.<br><br>Best regards,<br>KK Soltec Team`
        );

        // send email to admin
        const emailToAdmin = mailSender(    
             process.env.ADMIN_EMAIL,
           'New Contact Us Form Submission',
            `New contact form submission:<br><br>Name: ${firstName} ${lastName}<br>Email: ${email}<br>Phone: ${mphone}<br>Message: ${message}`
        );

        console.log('Sending emails to user and admin...');
        
        await Promise.all([emailToUser, emailToAdmin]);

        return res.status(200).json({
            success: true,
            message: 'Contact form submitted successfully'
        });

    } catch (error) {
        console.error('Error in contact us handler:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
