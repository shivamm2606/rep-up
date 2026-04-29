import { z } from "zod";
import { paginationSchema } from "./common.validator.js";

const muscleGroupEnum = z.enum([
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
  "full_body",
  "upper_body",
  "lower_body",
]);

const categoryEnum = z.enum(["strength", "cardio", "flexibility"]);

export const createExerciseSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  category: categoryEnum,
  muscleGroup: muscleGroupEnum,
});

export const updateExerciseSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  category: categoryEnum.optional(),
  muscleGroup: muscleGroupEnum.optional(),
});

export const getExercisesQuerySchema = paginationSchema.extend({
  muscleGroup: muscleGroupEnum.optional(),
  category: categoryEnum.optional(),
  search: z.string().optional(),
});

export type CreateExerciseDto = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseDto = z.infer<typeof updateExerciseSchema>;
export type GetExercisesDto = z.infer<typeof getExercisesQuerySchema>;
