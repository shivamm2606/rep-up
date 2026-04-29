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
import { exerciseIdParamSchema } from "../validator/common.validator.js";

const router = Router();

//protected
router.use(verifyJWT);

router
  .route("/")
  .get(validate(getExercisesQuerySchema, "query"), getAllExercises)
  .post(validate(createExerciseSchema), createExercise);
router
  .route("/:exerciseId")
  .get(validate(exerciseIdParamSchema, "params"), getExerciseById)
  .patch(
    validate(exerciseIdParamSchema, "params"),
    validate(updateExerciseSchema),
    updateExercise,
  )
  .delete(validate(exerciseIdParamSchema, "params"), deleteExercise);

export default router;
