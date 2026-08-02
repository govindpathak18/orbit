import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/auth.route.js';

dotenv.config();

const PORT = process.env.PORT || 8001;

const allowedOrigins = [
  process.env.CORS_ORIGINS,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://localhost:3000',
].filter(Boolean);

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
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-email', 'x-user-role', 'Cookie'],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 204,
  })
);
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