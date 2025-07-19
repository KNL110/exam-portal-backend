import { Response } from "../models/response.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const getResponse = asyncHandler(async (req, res) => {

    const responses = await Response.find();

    if (!responses) {
        throw new ApiError(404, 'Exam responses not found');
    }

    return res.status(200).json(
        new ApiResponse(200, responses, 'Exam responses fetched successfully')
    );

});