import { Router } from "express";
import { login , registerProfessor} from "../controllers/professorControllers.js";

const router = Router();

router.route("/register").post(registerProfessor);
//login
router.route("/login").post(login);

export default router;