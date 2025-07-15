import { Router } from "express";
import { login , registerCandidate} from "../controllers/candidateControlllers.js";

const router = Router();

router.route("/register").post(registerCandidate);
//login
router.route("/login").post(login);

export default router;