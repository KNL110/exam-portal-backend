import { Router } from "express";
import { login ,
        logoutcandidate, 
        registerCandidate, 
        getStudentById, 
        getMultipleStudents 
    } from "../controllers/candidateControlllers.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/register").post(registerCandidate);
//login
router.route("/login").post(login);

//secured routes
router.route("/logout").post(verifyJWT ,logoutcandidate);
router.route("/getStudent/:studentId").get(verifyJWT, getStudentById);
router.route("/getStudents").post(verifyJWT, getMultipleStudents);

export default router;