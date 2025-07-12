import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const login = asyncHandler(async (req, res) => {
    console.log(req.body);
    if (!req.body) {
        const data =  { suggestion: "maybe try giving a json raw data" };
        throw new ApiError(400, "request body not found");
    }
    return res.status(200).json({
        message: "this is professor login page, working fine"
    });
});