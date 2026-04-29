import { z } from "zod";

export const updateUserInfoSchema = z
  .object({
    height: z.number().positive().optional(),
    currentWeight: z.number().positive().optional(),
    targetWeight: z.number().positive().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    dateOfBirth: z.coerce.date().optional(),
    activityLevel: z
      .enum(["sedentary", "lightly_active", "moderately_active", "very_active"])
      .optional(),
    goal: z.enum(["lose_weight", "maintain", "lean_bulk", "bulk"]).optional(),
    dailyCalorieGoal: z.number().positive().optional(),
    isCalorieGoalAutoCalculated: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided",
  });

export const updateAccountSchema = z
  .object({
    name: z.string().trim().min(2).max(50).optional(),
    email: z.email().trim().toLowerCase().optional(),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3)
      .max(30)
      .regex(/^[a-z0-9_]+$/, { error: "Invalid username format" })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    error: "At least one field must be provided",
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { error: "Current password is required" }),
  newPassword: z.string().min(8, { error: "New password must be at least 8 characters" }),
});

export type UpdateUserInfoDto = z.infer<typeof updateUserInfoSchema>;
export type UpdateAccountDto = z.infer<typeof updateAccountSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
