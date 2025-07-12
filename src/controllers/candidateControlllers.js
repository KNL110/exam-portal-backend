import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Candidate } from "../models/student.js";
import validator from "validator";


export const login = asyncHandler(async (req, res) => {

    const { identifier, password } = req.body;

    if ([identifier, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "ID/email and password required");
    }

    const query = validator.isEmail(identifier) ? { "email": identifier } : { "rollNumber": identifier };

    const candidate = await Candidate.findOne(query);
    
    if (!candidate) {
        throw new ApiError(401, "Invalid student ID or Email Id");
    }
    
    const pass = await candidate.isPasswordCorrect(password);

    if (!pass) {
        throw new ApiError(401, "Invalid Password");
    }




    return res.status(200).json({
        message: "this is candidate login page, working fine"
    });
});