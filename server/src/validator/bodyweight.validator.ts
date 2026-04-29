import { z } from "zod";

export const logBodyweightSchema = z.object({
  weight: z.number().positive({ error: "Weight must be a positive number" }),
  unit: z.enum(["kg", "lbs"]),
  date: z.coerce.date().optional(),
  notes: z.string().max(500).optional(),
});

export type LogBodyweightDto = z.infer<typeof logBodyweightSchema>;
