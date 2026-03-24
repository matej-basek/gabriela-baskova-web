const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const studiosRoutes = require('./routes/studios');
const contactRoutes = require('./routes/contact');
const seedRoutes = require('./routes/seed');

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'https://gabrielabaskova.cz',
    'https://www.gabrielabaskova.cz',
    'https://gb-frontend-3o11.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // Povol requests bez originu (Postman, curl) nebo z povolených domén
        if (!origin) return callback(null, true);
        // Povol všechny *.onrender.com subdomény
        if (origin.endsWith('.onrender.com')) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/studios', studiosRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/seed', seedRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// MongoDB connection + server start
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });
