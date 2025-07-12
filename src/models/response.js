import mongoose from "mongoose";

const responseSchema = mongoose.Schema({
    examID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "exam",
    },
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    },
    answers: [
        {
            questionID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'question'
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
    timetaken : {
        type : Number,
        required : true
    }
}, { timestamps: true });

export const response = mongoose.model("responses", responseSchema);