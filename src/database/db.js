import mongoose from "mongoose";
import { DB_URI } from "../constants.js";

const connectDB = async () => {
    try {
        console.log('Connecting to DB...');
        const conn = await mongoose.connect(`${DB_URI}`, () => {
            console.log(`Database Connected !!\nDB_HOST: ${conn.connection.host}`);
            console.log("Connected to DB:", mongoose.connection.name);
        });

    } catch (error) {
        console.error("DATABASE CONNECTION FAILED!", error);
        process.exit(1);
    }
}
export default connectDB;