import mongoose from "mongoose";

const responseSchema = mongoose.Schema({
    examID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exams",
    },
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidates"
    },
    answers: [
        {
            questionID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'questions'
            },
            type: {
                type: String,
                enum: ['MCQ', 'NAT'],
                required: true
            },
            selectedOptions: [String],
            numericalAnswer: String
        }
    ],
    score : {
        type : Number,
        required : true
    },
    startTime: Date,
    endTime: Date,
    timetaken : Number,
}, { timestamps: true });

export const Response = mongoose.model("responses", responseSchema);