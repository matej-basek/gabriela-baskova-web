const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// POST /api/contact — public
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
        if (!accessKey) {
            return res.status(500).json({ message: 'WEB3FORMS_ACCESS_KEY is not configured on the server.' });
        }

        // Use native fetch to POST to Web3Forms HTTP API (bypasses SMTP block on Render)
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                access_key: accessKey,
                name: name,
                email: email,
                message: message,
                subject: `📩 Nová zpráva z webu – ${name}`,
                from_name: 'Gabriela Bašková Web',
                replyto: email,
            }),
        });

        const result = await response.json();

        if (response.status === 200) {
            res.json({ message: 'Message sent successfully' });
        } else {
            console.error('Web3Forms error:', result);
            res.status(500).json({ message: 'Failed to send email via Web3Forms' });
        }
    } catch (err) {
        console.error('Email error:', err);
        res.status(500).json({ message: 'Failed to send email' });
    }
});

module.exports = router;
