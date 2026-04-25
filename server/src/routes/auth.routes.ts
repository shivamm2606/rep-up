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

//protected
router.use(verifyJWT);

router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshToken);

export default router;
