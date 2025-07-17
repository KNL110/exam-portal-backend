import { REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET } from "../constants.js";
import jwt from "jsonwebtoken";
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

professorSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            role: "professor"
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY
        }
    );
}

professorSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY
        }
    );
}

export const Professor = mongoose.model("professors", professorSchema);

