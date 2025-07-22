import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./models/controllers/userController.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', userRoutes);

const PORT = process.env.PORT || 5000;
const mongodbURL = process.env.mongodbURL;

mongoose.connect(mongodbURL)
    .then(() => {
        console.log(`✅ Database connected successfully`);
        app.listen(PORT, () => {
            console.log(`🚀 App is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`❌ Database connection failed:`, error);
    });
