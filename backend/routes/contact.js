const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// POST /api/contact — public
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message)
            return res.status(400).json({ message: 'All fields are required' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"${name}" <${process.env.GMAIL_USER}>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `📩 Nová zpráva z webu – ${name}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #9b51e0;">Nová zpráva z kontaktního formuláře</h2>
          <p><strong>Jméno:</strong> ${name}</p>
          <p><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border-color: #f78da7;" />
          <h3>Zpráva:</h3>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr style="border-color: #f78da7;" />
          <p style="color: #999; font-size: 12px;">Odesláno z webu gabrielabaskova.cz</p>
        </div>
      `,
        });

        res.json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

module.exports = router;
