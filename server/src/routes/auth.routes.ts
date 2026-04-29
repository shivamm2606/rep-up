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

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshToken);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

//protected
router.use(verifyJWT);
router.route("/logout").post(logoutUser);

export default router;
