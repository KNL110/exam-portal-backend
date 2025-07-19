import { Router } from "express";
import { createExam, getExam, getExams, startExam, submitExam } from "../controllers/examControllers.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { getResponse } from "../controllers/responseControllers.js";

const router = Router();

//secured routes
router.route("/creatExam").post(verifyJWT, createExam);
router.route("/getExam/:examID").get(verifyJWT, getExam);
router.route("/getExam").get(verifyJWT, getExams);
router.route("/startExam/:examID").post(verifyJWT, startExam);
router.route("/submitExam/:examID").post(verifyJWT, submitExam);
router.route("/examResult").get(verifyJWT,getResponse);

// Test endpoint
router.route("/test").get(verifyJWT, (req, res) => {
    res.json({
        success: true,
        message: "Authentication working",
        user: {
            id: req.user._id,
            role: req.user.role,
            name: req.user.name
        }
    });
});

export default router;
