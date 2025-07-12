import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const login = asyncHandler(async (req, res) => {
    console.log(req.body);
    if (!req.body) {
        throw new ApiError(400, "request body not found", { suggestion: "maybe try giving a json raw data" });
    }
    return res.status(200).json({
        message: "this is candidate login page, working fine"
    });
});