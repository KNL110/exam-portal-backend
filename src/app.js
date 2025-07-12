import express from "express";
import cors from "cors";
import { CROS_ORIGIN } from "./constants.js";

const app = express();

app.use(cors({
    origin : CROS_ORIGIN,
    credentials : true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true, limit:"16kb"}));


export {app};