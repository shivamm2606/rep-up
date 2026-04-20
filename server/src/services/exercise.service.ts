import User from "../models/user.model.js";
import { IExercise } from "../types/workout.types.js";
import {
  IExerciseService,
  CreateExerciseDto,
  UpdateExerciseDto,
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
      throw new ApiError(400, "User not found");
    }

    const { name, category, muscleGroup } = dto;

    const createdExercise = await Exercise.create({
      name,
      category,
      muscleGroup,
      isCustom: false,
    });

    if (user.role === "user") {
      createdExercise.isCustom = true;
      createdExercise.createdBy = user._id;
      await createdExercise.save();
    }

    return createdExercise;
  };

  updateExercise = async (
    userId: string,
    exerciseId: string,
    dto: UpdateExerciseDto,
  ): Promise<IExercise | null> => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(400, "User not found");
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
      exercise.createdBy === user._id
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
      throw new ApiError(400, "User not found");
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
      exercise.createdBy === user._id
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
      throw new ApiError(400, "User not found");
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
      (exercise.isCustom === false || exercise.createdBy === user._id)
    ) {
      return exercise;
    }

    throw new ApiError(400, "Unable to fetch the exercise");
  };

  getAllExercise = async (userId: string): Promise<IExercise[]> => {
    const exercises = await Exercise.find({
      $or: [{ isCustom: false }, { isCustom: true, createdBy: userId }],
    });

    return exercises;
  };
}

export default new MongoExerciseService();

// done two services now make other three and create controller for these
// then routes
