const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'gabriela_baskova/events',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
        format: 'avif',
        transformation: [{ quality: 'auto:good' }]
    },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/events — public
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ order: 1, createdAt: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/events — admin only
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const { title, description, registrationUrl, date, order } = req.body;
        if (!req.file) return res.status(400).json({ message: 'Image is required' });

        const imageUrl = req.file.path;
        const event = new Event({ title, description, imageUrl, registrationUrl, date: date || null, order: order || 0 });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Server error' });
    }
});

// PUT /api/events/:id — admin only
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const { title, description, registrationUrl, date, order } = req.body;
        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (registrationUrl !== undefined) event.registrationUrl = registrationUrl;
        if (date !== undefined) event.date = date || null;
        if (order !== undefined) event.order = order;

        if (req.file) {
            event.imageUrl = req.file.path;
        } else if (req.body.existingImageUrl) {
            event.imageUrl = req.body.existingImageUrl;
        }

        await event.save();
        res.json(event);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/events/:id — admin only
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        await event.deleteOne();
        res.json({ message: 'Event deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
