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
import {
  sessionIdParamSchema,
  sessionExerciseParamSchema,
  sessionSetParamSchema,
  paginationSchema,
} from "../validator/common.validator.js";

const router = Router();

//protected
router.use(verifyJWT);

router
  .route("/")
  .get(validate(paginationSchema, "query"), getAllSessions)
  .post(validate(createSessionSchema), createSession);
router
  .route("/:sessionId")
  .get(validate(sessionIdParamSchema, "params"), getSessionById)
  .delete(validate(sessionIdParamSchema, "params"), deleteSession);
router
  .route("/:sessionId/exercise")
  .post(
    validate(sessionIdParamSchema, "params"),
    validate(addExerciseToSessionSchema),
    addExerciseToSession,
  );
router
  .route("/:sessionId/exercise/:exerciseId")
  .delete(
    validate(sessionExerciseParamSchema, "params"),
    removeExerciseFromSession,
  );
router
  .route("/:sessionId/set")
  .post(
    validate(sessionIdParamSchema, "params"),
    validate(logSetSchema),
    logSet,
  );
router
  .route("/:sessionId/exercise/:exerciseId/set/:setIndex")
  .delete(validate(sessionSetParamSchema, "params"), removeSetFromSession);
router
  .route("/:sessionId/complete")
  .patch(validate(sessionIdParamSchema, "params"), completeSession);

export default router;
