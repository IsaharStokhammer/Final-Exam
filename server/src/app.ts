import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/errorHandler";
import SeedDBRoute from "./routes/seedDBRoute";
import analysisRoute from "./routes/analysisRoute";
import crudRoute from "./routes/crudRoute";
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());


app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5175",
//     credentials: true, // Required for cookies
//   })
// );

// Routes
app.use("/api/analysis", analysisRoute);
app.use("/seed", SeedDBRoute);
app.use("/crud", crudRoute);

// Error handling middleware

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🍿🍿🍿`);
});

export default app;
