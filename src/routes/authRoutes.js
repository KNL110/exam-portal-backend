import { Router } from "express";
import { Candidate } from "../models/student.js";
import { Professor } from "../models/professor.js";
import { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY } from "../constants.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

async function refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "refreshtoken not found")
    }

    try {
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

        let user;

        if (decoded.role === "candidate") {
            user = await Candidate.findById(decoded._id);
        } else if (decoded.role === "professor") {
            user = await Professor.findById(decoded._id);
        }

        if (!user) {
            throw new ApiError(401, "user not found");
        }

        const newAccessToken = jwt.sign(
            { 
                _id: user._id, 
                role: decoded.role 
            },
            ACCESS_TOKEN_SECRET,
            { 
                expiresIn: ACCESS_TOKEN_EXPIRY
            }
        );

        return res.status(200).json(
            new ApiResponse(200, { accessToken: newAccessToken }, "new accesstoken generated successfully")
        );
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
}

router.post("/refresh", refresh);

export default router;
