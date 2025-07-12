import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Professor } from "../models/professor.js";
import validator from "validator";


export const login = asyncHandler(async (req, res) => {

    const { identifier, password } = req.body;

    if ([identifier, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "ID/email and password required");
    }

    const query = validator.isEmail(identifier) ? { "email": identifier } : { "professorID": identifier };

    const professor = await Professor.findOne(query);
    
    if (!professor) {
        throw new ApiError(401, "Invalid professor ID or Email Id");
    }
    
    const pass = await professor.isPasswordCorrect(password);
    
    if (!pass) {
        throw new ApiError(401, "Invalid Password");
    }




    return res.status(200).json({
        message: "this is professor login page, working fine"
    });
});