const express = require('express');
const { sendMail } = require('../util/mailer');
const router = express.Router();

router.post('/send-test-email', async (req, res) => {
    const { email } = req.body;

    await sendMail({
        to: email,
        subject: "Test Email from MyApp",
        text: "Hello! This is a plain text test email.",
        html: "<h1>Hello!</h1><p>This is a test email from MyApp.</p>",
    });

    res.json({ message: "Email sent (check console)" });
});

module.exports = router;
