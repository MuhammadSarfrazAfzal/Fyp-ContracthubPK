require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const run = async () => {
    console.log('Testing email credentials...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);
    
    await sendEmail({
        email: process.env.EMAIL_USER, // Send to self
        subject: 'Test Email Notification',
        message: 'This is a test email to verify credentials.',
    });
    console.log('Test complete. If there was no error, the email was sent or queued.');
};
run();
