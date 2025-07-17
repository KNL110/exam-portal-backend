import dotenv from "dotenv";dotenv.config({path : "./.env"});

export const PORT = process.env.PORT || 4000;
export const DB_NAME = "examPortal";
export const DB_URI = `${process.env.MONGODB_URI}/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;

export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;