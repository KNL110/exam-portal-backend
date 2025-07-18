import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { CORS_ORIGIN } from "./constants.js";
import { globalError } from "./middlewares/globalerror.js";

const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

//import routers
import candidateRouter from "./routes/candidateRoutes.js";
import professorRouter from "./routes/professorRoutes.js";

//setup routes
app.use("/api/v1/candidate", candidateRouter);
app.use("/api/v1/professor", professorRouter);

// app.use(globalError);
export { app };