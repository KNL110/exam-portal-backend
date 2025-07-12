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
            ref: "question",
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "professor",
        required: true
    },
    exmaDate: Date,
    startTime: Date,
    endTime: Date
}, { timestamps: true });

export const exam = mongoose.model("exams", examSchema);

