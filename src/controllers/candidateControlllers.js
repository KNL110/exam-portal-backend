import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { Candidate } from "../models/student.js";
import validator from "validator";

export const generateTokens = async (user) => {
    try {
        let refreshToken = await user.generateRefreshToken();
        let accessToken = await user.generateAccessToken();

        user.refreshtoken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };
    } catch (error) {
        console.error("Token generation error:", error);

        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

export const registerCandidate = asyncHandler(async (req, res) => {

    const { fullname, email, password } = req.body;

    if ([fullname, email, password].some((field) => field ? "" : field.trim() === "")) {
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

    const newCandidate = await Candidate.findById(candidate._id).select("-password -refreshToken");

    if (!newCandidate) {
        throw new ApiError(500, "Something went wrong while registering the Candidate");
    }

    return res.status(201).json(
        new ApiResponse(201, newCandidate, "Candidate registered Successfully")
    )

});

export const login = asyncHandler(async (req, res) => {

    const { identifier, password } = req.body;

    if ([identifier, password].some((field) => field ? "" : field.trim() === "")) {
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

    const { refreshToken, accessToken } = await generateTokens(candidate);

    const loggedUser = await candidate.findById(candidate._id).select("-password -refreshtoken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    candidate: loggedUser, refreshToken, accessToken
                },
                "Login Successful"
            )
        );
});

export const logoutcandidate = asyncHandler(async (req, res) => {
    await Candidate.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshtoken: undefined }
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "candidate logged out"));
});