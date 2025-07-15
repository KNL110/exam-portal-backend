import mongoose from 'mongoose';
import bcrypt from "bcrypt";

//a counter schema for per-year-month sequence tracking
const counterSchema = new mongoose.Schema({
    yearMonth: String,
    seq: Number
});
const Counter = mongoose.model('Counter', counterSchema);

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    rollNumber: {
        type: String,
        unique: true,
        trim: true
    },
    seatingNumber: {   //seating numbers generated 1 day before the exam
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
        enum: ['Male', 'Female', 'Other']
    },
    refreshtoken: {
        type: String,
        default: ""
    }
}, { timestamps: true });

candidateSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

candidateSchema.pre('save', async function (next) {
    if (this.rollNumber) return next();

    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const yearMonth = `${year}${month}`;

    const counter = await Counter.findOneAndUpdate(
        { yearMonth },
        { $inc: { seq: 0 } },
        { new: true, upsert: true }
    );

    const sequence = String(counter.seq).padStart(4, '0');

    this.rollNumber = `${year}${month}${sequence}`; //maybe chances of error in syntax

    next();
});

candidateSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export const Candidate = mongoose.model("candidates", candidateSchema);