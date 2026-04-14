import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changePassword,
  getProfile,
  updateAccount,
  updateUserInfo,
} from "../controllers/user.controller.js";

const router = Router();

// protected
router.route("/profile").get(verifyJWT, getProfile);
router.route("/profile").patch(verifyJWT, updateUserInfo);

router.route("/account").patch(verifyJWT, updateAccount);
router.route("/change-password").patch(verifyJWT, changePassword);

export default router;
