import User from "../models/user.model.js";
import { IExercise } from "../types/workout.types.js";
import {
  IExerciseService,
  CreateExerciseDto,
  UpdateExerciseDto,
  GetExercisesDto,
  PaginatedExercisesResponse,
} from "../types/workout.service.interfaces.js";
import { ApiError } from "../utils/apiError.js";
import Exercise from "../models/exercise.model.js";

class MongoExerciseService implements IExerciseService {
  createExercise = async (
    userId: string,
    dto: CreateExerciseDto,
  ): Promise<IExercise> => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const { name, category, muscleGroup } = dto;

    const createdExercise = await Exercise.create({
      name,
      category,
      muscleGroup,
      isCustom: user.role === "user" ? true : false,
      createdBy: user.role === "user" ? user._id : undefined,
    });

    return createdExercise;
  };

  updateExercise = async (
    exerciseId: string,
    userId: string,
    dto: UpdateExerciseDto,
  ): Promise<IExercise | null> => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      throw new ApiError(400, "Exercise not found");
    }

    if (user.role === "admin" && exercise.isCustom === false) {
      Object.assign(exercise, dto);
      await exercise.save();
      return exercise;
    }

    if (
      user.role === "user" &&
      exercise.isCustom === true &&
      exercise.createdBy?.equals(user._id)
    ) {
      Object.assign(exercise, dto);
      await exercise.save();
      return exercise;
    }

    throw new ApiError(403, "Cannot edit exercise");
  };

  deleteExercise = async (
    exerciseId: string,
    userId: string,
  ): Promise<void> => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      throw new ApiError(400, "Exercise not found");
    }

    if (user.role === "admin" && exercise.isCustom === false) {
      await exercise.deleteOne();
      return;
    }

    if (
      user.role === "user" &&
      exercise.isCustom === true &&
      exercise.createdBy?.equals(user._id)
    ) {
      await exercise.deleteOne();
      return;
    }

    throw new ApiError(403, "Unable to delete exercise");
  };

  getExerciseById = async (
    exerciseId: string,
    userId: string,
  ): Promise<IExercise> => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      throw new ApiError(400, "Exercise not found");
    }

    if (user.role === "admin") {
      return exercise;
    }

    if (
      user.role === "user" &&
      (exercise.isCustom === false || exercise.createdBy?.equals(user._id))
    ) {
      return exercise;
    }

    throw new ApiError(403, "Unable to fetch the exercise");
  };

  getAllExercises = async (
    userId: string,
    filters: GetExercisesDto,
  ): Promise<PaginatedExercisesResponse> => {
    const { muscleGroup, category, search, page = 1, limit = 10 } = filters;

    const query: any = {
      $or: [{ isCustom: false }, { isCustom: true, createdBy: userId }],
    };

    if (muscleGroup) query.muscleGroup = muscleGroup;
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const skip = (page - 1) * limit;

    const [exercises, total] = await Promise.all([
      Exercise.find(query).sort({ name: 1 }).skip(skip).limit(limit),
      Exercise.countDocuments(query),
    ]);

    return {
      exercises,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  };
}

export default new MongoExerciseService();
