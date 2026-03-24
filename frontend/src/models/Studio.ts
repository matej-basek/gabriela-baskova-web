import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    day: { type: String, required: false },
    time: { type: String, required: false },
    pricePerLesson: { type: String, required: false },
    dateRange: { type: String, required: false },
    courseInfo: { type: String, required: false },
    coursePrice: { type: String, required: false },
    additionalInfo: { type: String, required: false },
    registrationUrl: { type: String, required: false }
});

const StudioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    photoUrl: { type: String, required: false },
    lessons: [LessonSchema]
}, { timestamps: true });

export default mongoose.models.Studio || mongoose.model('Studio', StudioSchema);
