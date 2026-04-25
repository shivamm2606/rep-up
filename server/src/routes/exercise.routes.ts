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

router.route("/").get(getAllExercises).post(createExercise);
router
  .route("/:exerciseId")
  .get(getExerciseById)
  .patch(updateExercise)
  .delete(deleteExercise);

export default router;
