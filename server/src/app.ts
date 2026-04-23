import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import exerciseRoutes from "./routes/exercise.routes.js";
import workoutTemplateRoutes from "./routes/workoutTemplate.routes.js";
import WorkoutSessionRoutes from "./routes/workoutSession.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/exercises", exerciseRoutes);
app.use("/api/v1/workout-templates", workoutTemplateRoutes);
app.use("/api/v1/workout-session", WorkoutSessionRoutes);

export default app;
