import express from "express";
import db from "./config/database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import FileUpload from "express-fileupload";
import cors from "cors";
import ArsipRoute from "./routers/ArsipRoute.js";
import DataRoute from "./routers/DataRoute.js";
import UserRoute from "./routers/UserRoute.js";

try {
    await db.authenticate();
    console.log('Database Connected');
} catch (error) {
    console.error(error);
}

dotenv.config();
const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:5173'}));
app.use(cookieParser())
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));

app.use(DataRoute);
app.use(ArsipRoute);
app.use(UserRoute);

app.listen(5000, ()=> console.log("Server Sedang berjalan di http://localhost:5000"));