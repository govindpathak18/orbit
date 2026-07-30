import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import dotenv from "dotenv"
import router from "./routes/billing.routes.js";

dotenv.config()

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
].filter(Boolean);

const port = process.env.PORT
const app = express();

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/", router);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Billing Service Running"
    });
});

app.listen(port, () => {
    connectDB()
    console.log(`🚀 Billing service is running on port ${port}`);
});