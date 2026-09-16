import { Router } from "express";
import { login , logoutprofessor, registerProfessor} from "../controllers/professorControllers.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/register").post(registerProfessor);
//login
router.route("/login").post(login);

//secured routes
router.route("/logout").post(verifyJWT ,logoutprofessor);

export default router;