import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import validator from "validator";
import { candidateModel } from "../models/student.js";

export const login = asyncHandler(async (req, res) => {

    const { identifier, password } = req.body;

    if ([identifier, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "username/email or password required");
    }

    const query = validator.isEmail(identifier) ? { "email": identifier } : { "rollNumber": identifier };

    const candidate = await candidateModel.findOne(query);

    if (!candidate) {
        throw new ApiError(401, "Invalid username or Email Id");
    }



    return res.status(200).json({
        message: "this is candidate login page, working fine"
    });
});