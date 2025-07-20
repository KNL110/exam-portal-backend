// Response controllers - handle exam response operations
import { Response } from "../models/response.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import validator from "validator";


export const getResponse = asyncHandler(async (req, res) => {
    
    const responses = await Response.find().populate('studentID', 'name rollNumber')

    if (!responses) {
        throw new ApiError(404, 'No exam responses found');
    }

    return res.status(200).json(
        new ApiResponse(200, responses, 'Exam responses fetched successfully')
    );
});

export const getOneResponse = asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    
    const isEmail = validator.isEmail(identifier);
    
    const pipeline = [
        {
            $lookup: {
                from: "candidates", // Collection name for students
                localField: "studentID",
                foreignField: "_id",
                as: "studentData"
            }
        },
        {
            $lookup: {
                from: "exams", // Collection name for exams
                localField: "examID",
                foreignField: "_id",
                as: "examData"
            }
        },
        {
            $unwind: {
                path: "$studentData",
            }
        },
        {
            $unwind: {
                path: "$examData",
            }
        },
        {
            $match: isEmail 
                ? { "studentData.email": identifier }
                : { "studentData.rollNumber": identifier }
        },
        {
            $project: {
                _id: 1,
                studentID: 1,
                answers: 1,
                score: 1,
                startTime: 1,
                endTime: 1,
                timetaken: 1,
                createdAt: 1,
                updatedAt: 1,
                // Include exam ID from exam model (string format)
                "examID": "$examData.examID",
                // Only include requested student fields
                "student.name": "$studentData.name",
                "student.rollNumber": "$studentData.rollNumber",
                "student.email": "$studentData.email"
            }
        }
    ];

    const response = await Response.aggregate(pipeline);

    if (!response || response.length === 0) {
        throw new ApiError(404, 'No exam responses found');
    }
    
    return res.status(200).json(
        new ApiResponse(200, response, 'Exam responses fetched successfully')
    );
});

