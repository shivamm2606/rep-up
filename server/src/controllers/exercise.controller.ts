import MongoExerciseService from "../services/exercise.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createExercise = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const createdExercise = await MongoExerciseService.createExercise(
    userId,
    req.body,
  );

  res
    .status(201)
    .json(
      new ApiResponse(201, createdExercise, "Exercise created successfully"),
    );
});

export const updateExercise = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId as string;
  const userId = req.user._id.toString();

  const updatedExercise = await MongoExerciseService.updateExercise(
    exerciseId,
    userId,
    req.body,
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedExercise, "Exercise updated successfully"),
    );
});

export const deleteExercise = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId as string;
  const userId = req.user._id.toString();

  await MongoExerciseService.deleteExercise(exerciseId, userId);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Exercise deleted successfully"));
});

export const getExerciseById = asyncHandler(async (req, res) => {
  const exerciseId = req.params.exerciseId as string;
  const userId = req.user._id.toString();

  const exercise = await MongoExerciseService.getExerciseById(
    exerciseId,
    userId,
  );

  res
    .status(200)
    .json(new ApiResponse(200, exercise, "Exercise fetched successfully"));
});

export const getAllExercises = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const allExercises = await MongoExerciseService.getAllExercises(userId);

  res.json(
    new ApiResponse(200, allExercises, "All Exercises fetched successfully"),
  );
});
