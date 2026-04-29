import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSession,
  deleteSession,
  getSessionById,
  getAllSessions,
  addExerciseToSession,
  logSet,
  completeSession,
  removeExerciseFromSession,
  removeSetFromSession,
} from "../controllers/workoutSession.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createSessionSchema,
  addExerciseToSessionSchema,
  logSetSchema,
} from "../validator/workoutSession.validator.js";

const router = Router();

//protected
router.use(verifyJWT);

router
  .route("/")
  .get(getAllSessions)
  .post(validate(createSessionSchema), createSession);
router.route("/:sessionId").get(getSessionById).delete(deleteSession);
router
  .route("/:sessionId/exercise")
  .post(validate(addExerciseToSessionSchema), addExerciseToSession);
router
  .route("/:sessionId/exercise/:exerciseId")
  .delete(removeExerciseFromSession);
router.route("/:sessionId/set").post(validate(logSetSchema), logSet);
router
  .route("/:sessionId/exercise/:exerciseId/set/:setIndex")
  .delete(removeSetFromSession);
router.route("/:sessionId/complete").patch(completeSession);

export default router;
