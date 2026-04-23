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

const router = Router();

router.use(verifyJWT);

// routes protected
router.route("/").get(getAllSessions).post(createSession);

router.route("/:sessionId").get(getSessionById).delete(deleteSession);

router.route("/:sessionId/exercise").post(addExerciseToSession);

router
  .route("/:sessionId/exercise/:exerciseId")
  .delete(removeExerciseFromSession);

router.route("/:sessionId/set").post(logSet);

router.route("/:sessionId/set/:setIndex").delete(removeSetFromSession);

router.route("/:sessionId/complete").patch(completeSession);

export default router;
