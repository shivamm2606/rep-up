import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyOtp, resendOtp } from "../controllers/auth.controller.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import {
  otpRateLimiter,
  forgotPasswordRateLimiter,
  loginRateLimiter,
} from "../middlewares/rateLimiter.js";
import { validate } from "../middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validator/auth.validator.js";

const router = Router();

router.route("/register").post(validate(registerSchema), registerUser);
router.route("/login").post(loginRateLimiter, validate(loginSchema), loginUser);
router.route("/refresh-token").post(refreshToken);

//rate limited routes
router.post(
  "/verify-otp",
  otpRateLimiter,
  validate(verifyOtpSchema),
  verifyOtp,
);
router.post(
  "/resend-otp",
  otpRateLimiter,
  validate(resendOtpSchema),
  resendOtp,
);
router.post(
  "/forgot-password",
  forgotPasswordRateLimiter,
  validate(forgotPasswordSchema),
  forgotPassword,
);

router.post(
  "/reset-password",
  forgotPasswordRateLimiter,
  validate(resetPasswordSchema),
  resetPassword,
);

//protected
router.use(verifyJWT);
router.route("/logout").post(logoutUser);

export default router;
