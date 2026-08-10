import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());
const port = process.env.PORT;

app.use("/", router);

// global error
app.use((err, req, res, next) => {
  console.error(err);
  if (err.status) {
    return res
      .status(err.status)
      .json(err.data);
  }

  return res
    .status(500)
    .json({
      success: false,
      message: err.message || "Internal Server Error"
    });

});

app.listen(port, () => {
  connectDB()
  console.log(`🚀 Agent service is running on port ${port}`);
});
