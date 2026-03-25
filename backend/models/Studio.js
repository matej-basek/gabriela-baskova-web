const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    day: { type: String, default: '' },
    time: { type: String, default: '' },
    pricePerLesson: { type: String, default: '' },
    courseInfo: { type: String, default: '' },
    coursePrice: { type: String, default: '' },
    dateRange: { type: String, default: '' },
    registrationUrl: { type: String, default: '' },
    additionalInfo: { type: String, default: '' },
});

const studioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photoUrl: { type: String, default: '' },
    lessons: [lessonSchema],
    order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Studio', studioSchema);
