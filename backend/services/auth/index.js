import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/auth.route.js';

dotenv.config();

const app = express();


app.use(cookieParser());
app.set("trust proxy", 1);

const PORT = process.env.PORT || 8001;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from Auth Service' });
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`🚀 Auth service is running on port ${PORT}`);
  connectDB();
});
