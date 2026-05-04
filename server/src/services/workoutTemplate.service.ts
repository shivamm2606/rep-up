import {
  IWorkoutTemplateService,
  CreateWorkoutTemplateDto,
  UpdateWorkoutTemplateDto,
} from "../types/workout.service.interfaces.js";
import { IWorkoutTemplate } from "../types/workout.types.js";
import WorkoutTemplate from "../models/workoutTemplate.model.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/user.model.js";

class MongoWorkoutTemplateService implements IWorkoutTemplateService {
  createTemplate = async (
    userId: string,
    dto: CreateWorkoutTemplateDto,
  ): Promise<IWorkoutTemplate> => {
    const { name, exercises } = dto;

    const createdTemplate = await WorkoutTemplate.create({
      name,
      userId,
      exercises,
    });

    return createdTemplate;
  };

  updateTemplate = async (
    templateId: string,
    userId: string,
    dto: UpdateWorkoutTemplateDto,
  ): Promise<IWorkoutTemplate | null> => {
    const template = await WorkoutTemplate.findById(templateId);

    if (!template) {
      throw new ApiError(400, "Template not found");
    }

    if (!template.userId.equals(userId)) {
      throw new ApiError(403, "Unauthorized");
    }

    Object.assign(template, dto);
    await template.save();

    return template;
  };

  deleteTemplate = async (
    templateId: string,
    userId: string,
  ): Promise<void> => {
    const template = await WorkoutTemplate.findById(templateId);

    if (!template) {
      throw new ApiError(400, "Template not found");
    }

    if (!template.userId.equals(userId)) {
      throw new ApiError(403, "Unauthorized");
    }

    await template.deleteOne();
  };

  getTemplateById = async (
    templateId: string,
    userId: string,
  ): Promise<IWorkoutTemplate> => {
    const template = await WorkoutTemplate.findById(templateId).populate(
      "exercises.exerciseId",
      "name muscleGroup category",
    );

    if (!template) {
      throw new ApiError(400, "Template not found");
    }

    if (!template.userId.equals(userId)) {
      throw new ApiError(403, "Unauthorized");
    }

    return template;
  };

  getAllTemplates = async (userId: string): Promise<IWorkoutTemplate[]> => {
    const adminUser = await User.findOne({ role: "admin" });
    const templates = await WorkoutTemplate.find({
      $or: [{ userId }, { userId: adminUser?._id }],
    }).populate("exercises.exerciseId", "name muscleGroup category");
    return templates;
  };
}

export default new MongoWorkoutTemplateService();
