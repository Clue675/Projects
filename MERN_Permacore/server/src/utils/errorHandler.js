const nodemailer = require('nodemailer');

/**
 * Sends an email using Outlook's SMTP server.
 * @param {string} to - Recipient's email address.
 * @param {string} subject - Subject of the email.
 * @param {string} text - Plain text body of the email.
 * @param {string} html - HTML body of the email (optional).
 * @param {Array} attachments - Array of attachment objects (optional).
 */
const sendEmail = async ({ to, subject, text, html = '', attachments = [] }) => {
    // Create a transporter object using Outlook's SMTP settings
    let transporter = nodemailer.createTransport({
        host: "smtp.office365.com", // Outlook's SMTP host
        port: 587, // Standard SMTP port
        secure: false, // False for 587, true for 465
        auth: {
            user: 'your_outlook_email@example.com', // Replace with your Outlook email
            pass: 'your_outlook_password' // Replace with your Outlook password
        },
        tls: {
            ciphers: 'SSLv3' // Required for Outlook
        }
    });

    // Send the email
    try {
        let info = await transporter.sendMail({
            from: '"Permacore_Supplier Quality" <your_outlook_email@example.com>', // Sender address
            to: to, // List of recipients
            subject: subject, // Subject line
            text: text, // Plain text body
            html: html, // HTML body
            attachments: attachments // Attachments array
        });

        console.log("Email sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = { sendEmail };
