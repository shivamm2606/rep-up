import { z } from "zod";

const strongPasswordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters" })
  .regex(/[A-Z]/, {
    error: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    error: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { error: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, {
    error: "Password must contain at least one special character",
  });

export { strongPasswordSchema };

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(50),
  email: z.email({ error: "Invalid email format" }).trim().toLowerCase(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, { error: "Username must be at least 3 characters" })
    .max(30)
    .regex(/^[a-z0-9_]+$/, {
      error:
        "Username can only contain lowercase letters, numbers, and underscores",
    }),
  password: strongPasswordSchema,
});

export const loginSchema = z.object({
  email: z.email({ error: "Invalid email format" }).trim().toLowerCase(),
  password: z.string().min(1, { error: "Password is required" }),
});

export const verifyOtpSchema = z.object({
  email: z.email().trim().toLowerCase(),
  otp: z
    .string()
    .length(6, { error: "OTP must be exactly 6 digits" })
    .regex(/^\d+$/, { error: "OTP must contain only digits" }),
});

export const resendOtpSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const forgotPasswordSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, { error: "Token is required" }),
  newPassword: strongPasswordSchema,
});

export type RegisterDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;
