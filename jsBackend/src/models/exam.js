import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    examID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    examName: {
        type: String,
        required: true,
        trim: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    markingScheme: {
        correct: {
            type: Number,
            required: true
        },
        incorrect: {
            type: Number,
            required: true
        },
        unattempted: {
            type: Number,
            required: true
        }
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "questions",
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "professors",
        required: true
    },
    examDate: Date,
    startTime: Date,
    endTime: Date
}, { timestamps: true });

export const Exam = mongoose.model("exams", examSchema);

