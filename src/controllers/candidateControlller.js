import { asyncHandler } from "../utils/asyncHandler.js";


const login = asyncHandler(async (req, res) => {
    console.log(req);
    return res.status(200).json({
        message : "this is working fine"
    });
});