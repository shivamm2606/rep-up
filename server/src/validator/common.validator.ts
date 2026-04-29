import { z } from "zod";

// MongoDB ObjectId
export const mongoIdSchema = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, { error: "Invalid ID format" });

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const exerciseIdParamSchema = z.object({
  exerciseId: mongoIdSchema,
});

export const templateIdParamSchema = z.object({
  templateId: mongoIdSchema,
});

export const sessionIdParamSchema = z.object({
  sessionId: mongoIdSchema,
});

export const bodyweightIdParamSchema = z.object({
  bodyweightId: mongoIdSchema,
});

export const sessionExerciseParamSchema = z.object({
  sessionId: mongoIdSchema,
  exerciseId: mongoIdSchema,
});

export const sessionSetParamSchema = z.object({
  sessionId: mongoIdSchema,
  exerciseId: mongoIdSchema,
  setIndex: z.coerce.number().int().min(0, { error: "Set index must be non-negative" }),
});
