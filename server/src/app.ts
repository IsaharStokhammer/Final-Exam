import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/errorHandler";
import SeedDBRoute from "./routes/seedDBRoute";
import analysisRoute from "./routes/analysisRoute";
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Required for cookies
  })
);

// Routes
app.use("/api/analysis", analysisRoute);
app.use("/seed", SeedDBRoute);

// Error handling middleware

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🍿🍿🍿`);
});

export default app;
