import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Candidate } from "../models/student.js";
import validator from "validator";

export const registerCandidate = asyncHandler(async (req, res) => {

    const { fullname, email, password } = req.body;

    if ([fullname, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid Email address!");
    }

    const Candidate_exist = await Candidate.findOne({ "email": email });

    if (Candidate_exist) {
        throw new ApiError(409, "Candidate already registered");
    }


    const candidate = await Candidate.create({
        "name": fullname,
        "email": email,
        "password": password
    });

    const newCandidate = await Candidate.findById(Candidate._id).select("-password -refreshToken");

    if (!newCandidate) {
        throw new ApiError(500, "Something went wrong while registering the Candidate");
    }

    return res.status(201).json(
        new ApiResponse(200, newCandidate, "Candidate registered Successfully")
    )

});

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