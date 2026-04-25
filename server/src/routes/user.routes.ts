import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changePassword,
  getProfile,
  updateAccount,
  updateUserInfo,
} from "../controllers/user.controller.js";

const router = Router();

//protected
router.use(verifyJWT);

router.route("/profile").get(getProfile);
router.route("/profile").patch(updateUserInfo);

router.route("/account").patch(updateAccount);
router.route("/change-password").patch(changePassword);

export default router;
