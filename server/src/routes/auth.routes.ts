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
} from "../middlewares/rateLimiter.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshToken);

//rate limited routes
router.post("/verify-otp", otpRateLimiter, verifyOtp);
router.post("/resend-otp", otpRateLimiter, resendOtp);
router.post("/forgot-password", forgotPasswordRateLimiter, forgotPassword);

router.post("/reset-password", resetPassword);

//protected
router.use(verifyJWT);
router.route("/logout").post(logoutUser);

export default router;
