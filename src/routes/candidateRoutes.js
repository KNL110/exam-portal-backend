import { Router } from "express";
import { login , logoutcandidate, registerCandidate} from "../controllers/candidateControlllers.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.route("/register").post(registerCandidate);
//login
router.route("/login").post(login);

//secured routes
router.route("/logout").post(verifyJWT ,logoutcandidate);

export default router;