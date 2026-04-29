import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseById,
  getAllExercises,
} from "../controllers/exercise.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createExerciseSchema,
  updateExerciseSchema,
  getExercisesQuerySchema,
} from "../validator/exercise.validator.js";

const router = Router();

//protected
router.use(verifyJWT);

router
  .route("/")
  .get(validate(getExercisesQuerySchema, "query"), getAllExercises)
  .post(validate(createExerciseSchema), createExercise);
router
  .route("/:exerciseId")
  .get(getExerciseById)
  .patch(validate(updateExerciseSchema), updateExercise)
  .delete(deleteExercise);

export default router;
