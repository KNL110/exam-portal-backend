import { Router } from "express";
import { login } from "../controllers/professorControllers.js";

const router = Router();

//login
router.route("/login").post(login);

export default router;