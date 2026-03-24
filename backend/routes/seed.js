const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// GET /api/seed?token=YOUR_SECRET
// One-time admin creation endpoint - protected by secret token
router.get('/', async (req, res) => {
    const { token } = req.query;
    const SEED_TOKEN = process.env.SEED_TOKEN || 'seed_gabriela_2024';

    if (token !== SEED_TOKEN) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const existing = await User.findOne({ username: 'GabrielaBaskova' });

        // If reset=true is passed, force update the password
        if (existing && req.query.reset === 'true') {
            const passwordHash = await bcrypt.hash('GabrielaBaskova.1976', 12);
            existing.passwordHash = passwordHash;
            await existing.save();
            return res.json({
                message: 'Password reset successfully',
                username: 'GabrielaBaskova',
                password: 'GabrielaBaskova.1976',
            });
        }

        if (existing) {
            return res.json({ message: 'Admin user already exists', username: 'GabrielaBaskova' });
        }

        const passwordHash = await bcrypt.hash('GabrielaBaskova.1976', 12);
        await User.create({ username: 'GabrielaBaskova', passwordHash });

        return res.json({
            message: 'Admin user created successfully',
            username: 'GabrielaBaskova',
            password: 'GabrielaBaskova.1976',
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
