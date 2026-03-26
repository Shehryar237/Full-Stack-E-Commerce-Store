const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS 
    }
});

async function sendMail({ to, subject, text, html }) {
    try {
        const info = await transporter.sendMail({
        from: `"MyApp" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
        });
        console.log("Email sent:", info.messageId);
    } 
    catch (error) {
        console.error("Error sending email:", error);
    }
    }

module.exports = { sendMail };
