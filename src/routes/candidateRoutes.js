import { Router } from "express";
import { login } from "../controllers/candidateControlllers.js";

const router = Router();

//login
router.route("/login").post(login);

export default router;