import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Professor } from "../models/professor.js";
import validator from "validator";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateTokens } from "./candidateControlllers.js";

export const registerProfessor = asyncHandler(async (req, res) => {

    const { fullname, email, profid, password } = req.body;

    if ([fullname, email, profid, password].some((field) => field ? "" : field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid Email address!");
    }

    const prof_exist = await Professor.findOne({ "email": email });

    if (prof_exist) {
        throw new ApiError(409, "Professor already registered");
    }

    const professor = await Professor.create({
        "name": fullname,
        "professorID": profid,
        "email": email,
        "password": password
    });

    const newprofessor = await Professor.findById(professor._id).select("-password -refreshToken");

    if (!newprofessor) {
        throw new ApiError(500, "Something went wrong while registering the Professor");
    }

    return res.status(201).json(
        new ApiResponse(200, newprofessor, "Professor registered Successfully")
    )
});

export const login = asyncHandler(async (req, res) => {

    const { identifier, password } = req.body;

    if ([identifier, password].some((field) => field ? "" : field.trim() === "")) {
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

    const { refreshToken, accessToken } = await generateTokens(professor);

    const loggedUser = await professor.findById(professor._id).select("-password -refreshtoken");

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
                    user: loggedUser, refreshToken, accessToken
                },
                "Login Successful"
            )
        );
});

export const logoutprofessor = asyncHandler(async (req, res) => {
    await Professor.findByIdAndUpdate(
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
        .json(new ApiResponse(200, {}, "professor logged out"));
});