require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, attachments = []) => {
    const msg = {
        to, // Recipient
        from: process.env.SENDGRID_EMAIL, // Verified sender
        subject,
        text,
        attachments: attachments.map(attachment => ({
            content: attachment.content,
            filename: attachment.filename,
            type: attachment.type,
            disposition: attachment.disposition,
            content_id: attachment.content_id,
        })),
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
    }
};

module.exports = { sendEmail };
