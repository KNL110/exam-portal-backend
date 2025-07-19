// MongoDB database connection configuration
import mongoose from "mongoose";
import { DB_URI } from "../constants.js";

const connectDB = async () => {
    try {
        console.log('Connecting to DB...');

        const conn = await mongoose.connect(DB_URI);

        console.log("Database Connected !!");
        console.log(`DB_HOST: ${conn.connection.host}`);
        console.log(`Connected to DB: ${conn.connection.name}`);

    } catch (error) {
        console.error("DATABASE CONNECTION FAILED!", error);
        process.exit(1);
    }
};

export default connectDB;
