import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateById,
  getAllTemplates,
} from "../controllers/workoutTemplate.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  createTemplateSchema,
  updateTemplateSchema,
} from "../validator/workoutTemplate.validator.js";

const router = Router();

//protected
router.use(verifyJWT);

router.route("/").get(getAllTemplates);
router.route("/").post(validate(createTemplateSchema), createTemplate);
router.route("/:templateId").get(getTemplateById);
router
  .route("/:templateId")
  .patch(validate(updateTemplateSchema), updateTemplate);
router.route("/:templateId").delete(deleteTemplate);

export default router;
