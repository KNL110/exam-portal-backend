import dotenv from "dotenv";dotenv.config({path : "./.env"});

export const PORT = process.env.PORT || 4000;
export const DB_NAME = "examPortal";
export const DB_URI = `${process.env.MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
export const CROS_ORIGIN = process.env.CROS_ORIGIN;