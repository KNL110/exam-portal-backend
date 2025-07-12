import { app } from "./app.js";
import { PORT } from "./constants.js";
import connectDB from "./database/db.js";

connectDB()
.then(() => {
    app.on("error", (err) => {
        console.log("SOME ERROR OCCURED!", err );
    });

    app.listen(PORT, () => {
        console.log(`SERVER LISTENING ON PORT : ${PORT}`);
    });
})
.catch((error) => {
    console.log("DATABASE CONNECTION FAILED !!!", error);
})