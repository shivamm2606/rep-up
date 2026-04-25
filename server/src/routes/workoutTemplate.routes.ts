import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getTemplateById,
  getAllTemplates,
} from "../controllers/workoutTemplate.controller.js";

const router = Router();

//protected
router.use(verifyJWT);

router.route("/").get(getAllTemplates);
router.route("/").post(createTemplate);
router.route("/:templateId").get(getTemplateById);
router.route("/:templateId").patch(updateTemplate);
router.route("/:templateId").delete(deleteTemplate);

export default router;
