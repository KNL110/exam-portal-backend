import express from "express";
import cors from "cors";
import { CORS_ORIGIN } from "./constants.js";
import { globalError } from "./middlewares/globalerror.js";

const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html")); // Add pretty routes for your vanilla pages:
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html")); // Add pretty routes for your vanilla pages:
});

app.get("/registerCandidate", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register-candidate.html"));
});

app.get("/registerProfessor", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register-professor.html"));
});

//import routers
import candidateRouter from "./routes/candidateRoutes.js";
import professorRouter from "./routes/professorRoutes.js";

//setup routes
app.use("/api/v1/candidate", candidateRouter);
app.use("/api/v1/professor", professorRouter);

app.use(express.static(path.join(__dirname, "public")));  // Serve static files like CSS & JS
app.use(globalError);
export { app };