import mongoose from 'mongoose';
import bcrypt from "bcrypt";

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

professorSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

professorSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}


export const Professor = mongoose.model("professors", professorSchema);

