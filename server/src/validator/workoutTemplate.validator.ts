import { z } from "zod";
import { mongoIdSchema } from "./common.validator.js";

const templateExerciseSchema = z.object({
  exerciseId: mongoIdSchema,
  targetSets: z.int().min(1).optional(),
  notes: z.string().max(500).optional(),
});

export const createTemplateSchema = z.object({
  name: z.string().trim().min(1, { error: "Template name is required" }).max(100),
  exercises: z
    .array(templateExerciseSchema)
    .min(1, { error: "At least one exercise is required" }),
});

export const updateTemplateSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    exercises: z.array(templateExerciseSchema).min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided",
  });

export type CreateWorkoutTemplateDto = z.infer<typeof createTemplateSchema>;
export type UpdateWorkoutTemplateDto = z.infer<typeof updateTemplateSchema>;
