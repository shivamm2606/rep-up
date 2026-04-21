import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseById,
  getAllExercises,
} from "../controllers/exercise.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getAllExercises);
router.route("/").post(verifyJWT, createExercise);
router.route("/:exerciseId").get(verifyJWT, getExerciseById);
router.route("/:exerciseId").patch(verifyJWT, updateExercise);
router.route("/:exerciseId").delete(verifyJWT, deleteExercise);

export default router;
