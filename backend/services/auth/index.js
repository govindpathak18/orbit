import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/auth.route.js';

dotenv.config();

const PORT = process.env.PORT || 8001;

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from Auth Service' });
});

app.use("/",router);

app.listen(PORT, () => {
  console.log(`auth service is running on port ${PORT}`);
  connectDB();
});