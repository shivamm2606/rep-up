import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshToken);

//protected
router.use(verifyJWT);
router.route("/logout").post(logoutUser);

export default router;
