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

//protected
router.use(verifyJWT);

router.route("/").get(getAllExercises);
router.route("/").post(createExercise);
router.route("/:exerciseId").get(getExerciseById);
router.route("/:exerciseId").patch(updateExercise);
router.route("/:exerciseId").delete(deleteExercise);

export default router;
