import { Router } from "express";
import { login } from "../controllers/candidateControlller.js";

const router = Router();

//login
router.route("/login").post(login);