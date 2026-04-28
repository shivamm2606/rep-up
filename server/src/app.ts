import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import exerciseRoutes from "./routes/exercise.routes.js";
import workoutTemplateRoutes from "./routes/workoutTemplate.routes.js";
import workoutSessionRoutes from "./routes/workoutSession.routes.js";
import bodyweightRoutes from "./routes/bodyweight.routes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/exercises", exerciseRoutes);
app.use("/api/v1/workout-templates", workoutTemplateRoutes);
app.use("/api/v1/workout-session", workoutSessionRoutes);
app.use("/api/v1/bodyweight", bodyweightRoutes);

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message });
};

app.use(errorHandler);

export default app;
