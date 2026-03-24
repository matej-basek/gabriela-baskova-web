const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Studio = require('../models/Studio');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/studios');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /api/studios — public
router.get('/', async (req, res) => {
    try {
        const studios = await Studio.find().sort({ order: 1, createdAt: 1 });
        res.json(studios);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/studios/:id — public
router.get('/:id', async (req, res) => {
    try {
        const studio = await Studio.findById(req.params.id);
        if (!studio) return res.status(404).json({ message: 'Studio not found' });
        res.json(studio);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/studios — admin only
router.post('/', authMiddleware, upload.single('photo'), async (req, res) => {
    try {
        const { name, order } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });
        const photoUrl = req.file ? `/uploads/studios/${req.file.filename}` : '';
        const studio = new Studio({ name, photoUrl, lessons: [], order: order || 0 });
        await studio.save();
        res.status(201).json(studio);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/studios/:id — admin only
router.put('/:id', authMiddleware, upload.single('photo'), async (req, res) => {
    try {
        const studio = await Studio.findById(req.params.id);
        if (!studio) return res.status(404).json({ message: 'Studio not found' });

        const { name, order } = req.body;
        if (name !== undefined) studio.name = name;
        if (order !== undefined) studio.order = order;

        if (req.file) {
            if (studio.photoUrl) {
                const oldPath = path.join(__dirname, '..', studio.photoUrl);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            studio.photoUrl = `/uploads/studios/${req.file.filename}`;
        }

        await studio.save();
        res.json(studio);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/studios/:id — admin only
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const studio = await Studio.findById(req.params.id);
        if (!studio) return res.status(404).json({ message: 'Studio not found' });
        if (studio.photoUrl) {
            const oldPath = path.join(__dirname, '..', studio.photoUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        await studio.deleteOne();
        res.json({ message: 'Studio deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/studios/:id/lessons — admin only
router.post('/:id/lessons', authMiddleware, async (req, res) => {
    try {
        const studio = await Studio.findById(req.params.id);
        if (!studio) return res.status(404).json({ message: 'Studio not found' });
        studio.lessons.push(req.body);
        await studio.save();
        res.status(201).json(studio);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/studios/:id/lessons/:lessonId — admin only
router.put('/:id/lessons/:lessonId', authMiddleware, async (req, res) => {
    try {
        const studio = await Studio.findById(req.params.id);
        if (!studio) return res.status(404).json({ message: 'Studio not found' });
        const lesson = studio.lessons.id(req.params.lessonId);
        if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
        Object.assign(lesson, req.body);
        await studio.save();
        res.json(studio);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/studios/:id/lessons/:lessonId — admin only
router.delete('/:id/lessons/:lessonId', authMiddleware, async (req, res) => {
    try {
        const studio = await Studio.findById(req.params.id);
        if (!studio) return res.status(404).json({ message: 'Studio not found' });
        studio.lessons.pull({ _id: req.params.lessonId });
        await studio.save();
        res.json(studio);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
