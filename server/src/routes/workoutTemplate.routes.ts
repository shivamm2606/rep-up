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

router.route("/").get(verifyJWT, getAllTemplates);
router.route("/").post(verifyJWT, createTemplate);
router.route("/:templateId").get(verifyJWT, getTemplateById);
router.route("/:templateId").patch(verifyJWT, updateTemplate);
router.route("/:templateId").delete(verifyJWT, deleteTemplate);

export default router;
