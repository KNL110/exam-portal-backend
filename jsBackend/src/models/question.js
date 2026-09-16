import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    questionType: {
        type: String,
        enum: ['MCQ', 'NAT'],
        required: true
    },
    options: {
        type: [String],
        validate: [
            {
                validator: function (val) {
                    if (this.questionType === "MCQ") {
                        return val.length >= 2;
                    } // min options
                    return true;
                },
                message: 'There must be at least 2 options.'
            },
            {
                validator: function (val) {
                    if (this.questionType === "MCQ") {
                        return val.length <= 5;
                    } // max options
                    return true;
                },
                message: 'There cannot be more than 5 options.'
            }
        ]
    },
    image: {
        type: String,    //url path or server path
        trim: true,
        default: ""
    },
    correctOption: {
        type: Number     // For MCQ
    },
    correctValue: {
        type: Number    // For NAT
    },
    marks: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export const Question = mongoose.model("questions", questionSchema);