import MongoWorkoutTemplateService from "../services/workoutTemplate.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createTemplate = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const createdTemplate = await MongoWorkoutTemplateService.createTemplate(
    userId,
    req.body,
  );

  res
    .status(201)
    .json(
      new ApiResponse(201, createdTemplate, "Template created successfully"),
    );
});

export const updateTemplate = asyncHandler(async (req, res) => {
  const templateId = req.params.templateId as string;
  const userId = req.user._id.toString();

  const updatedTemplate = await MongoWorkoutTemplateService.updateTemplate(
    templateId,
    userId,
    req.body,
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedTemplate, "Template updated successfully"),
    );
});

export const deleteTemplate = asyncHandler(async (req, res) => {
  const templateId = req.params.templateId as string;
  const userId = req.user._id.toString();

  await MongoWorkoutTemplateService.deleteTemplate(templateId, userId);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Template deleted successfully"));
});

export const getTemplateById = asyncHandler(async (req, res) => {
  const templateId = req.params.templateId as string;
  const userId = req.user._id.toString();

  const template = await MongoWorkoutTemplateService.getTemplateById(
    templateId,
    userId,
  );

  res
    .status(200)
    .json(new ApiResponse(200, template, "Template fetched successfully"));
});

export const getAllTemplates = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const allTemplates =
    await MongoWorkoutTemplateService.getAllTemplates(userId);

  res.json(
    new ApiResponse(200, allTemplates, "All Templates fetched successfully"),
  );
});
