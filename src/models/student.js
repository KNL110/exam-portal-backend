import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    seatingNumber : {   //seating numbers generated 1 day before the exam
        type: String,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    refreshtoken: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const Candidate = mongoose.model("candidates", candidateSchema);