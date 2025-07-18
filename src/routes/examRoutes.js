import { Router } from "express";
import { createExam } from "../controllers/examControllers.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

//secured routes
router.route("/creatExam").post(verifyJWT ,createExam);

export default router;