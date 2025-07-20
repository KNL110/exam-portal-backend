import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { CORS_ORIGIN } from "./constants.js";
import { globalError } from "./middlewares/globalerror.js";

const app = express();

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

//import routers
import candidateRouter from "./routes/candidateRoutes.js";
import professorRouter from "./routes/professorRoutes.js";
import examRouter from "./routes/examRoutes.js";
import authRoute from "./routes/authRoutes.js"

//setup routes
app.use("/api/v1/candidate", candidateRouter);
app.use("/api/v1/professor", professorRouter);
app.use("/api/v1/exam", examRouter);
app.use("/api/v1/email", examRouter);
app.use("/api/v1/auth", authRoute);

app.use(globalError);
export { app };