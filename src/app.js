import express from "express";
import cors from "cors";
import { CROS_ORIGIN } from "./constants.js";
import { globalError } from "./middlewares/globalerror.js";

const app = express();

app.use(cors({
    origin : CROS_ORIGIN,
    credentials : true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(globalError);

//import routers

app.use("/api/v1");

export {app};