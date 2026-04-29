import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  logBodyweight,
  getBodyweightHistory,
  deleteBodyweightEntry,
} from "../controllers/bodyweight.controller.js";
import { validate } from "../middlewares/validate.js";
import { logBodyweightSchema } from "../validator/bodyweight.validator.js";

const router = Router();

//protected
router.use(verifyJWT);

router
  .route("/")
  .get(getBodyweightHistory)
  .post(validate(logBodyweightSchema), logBodyweight);
router.route("/:bodyweightId").delete(deleteBodyweightEntry);

export default router;
