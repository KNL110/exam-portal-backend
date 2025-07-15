import mongoose from 'mongoose';

const professorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    professorID: {
        type: String,
        required: true,
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
        enum: ['male', 'female', 'other']
    },
    refreshtoken: {
        type: String,
        default: ""
    }
}, { timestamps: true });

export const Professor = mongoose.model("professors", professorSchema);

