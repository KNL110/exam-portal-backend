import { ACCESS_TOKEN_SECRET } from "../constants.js";
import { Candidate } from "../models/student.js";
import { Professor } from "../models/professor.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";



export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        console.log(`\n${token}`);
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        const decodedtoken = jwt.verify(token, ACCESS_TOKEN_SECRET);

        let user;

        switch (decodedtoken.role) {
            case 'candidate':
                user = await Candidate.findById(decodedtoken?._id).select("-password -refreshtoken");
                break;
            case 'professor':
                user = await Professor.findById(decodedtoken?._id).select("-password -refreshtoken");
                break;
            default:
                throw new ApiError(401, 'Invalid access token');
        }

        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;
        req.user.role =decodedtoken.role;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access");
    }

})