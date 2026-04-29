import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  changePassword,
  getProfile,
  updateAccount,
  updateUserInfo,
  getCalorieGoal,
  deleteAccount,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  updateUserInfoSchema,
  updateAccountSchema,
  changePasswordSchema,
} from "../validator/user.validator.js";

const router = Router();

//protected
router.use(verifyJWT);

router.route("/profile").get(getProfile);
router.route("/profile").patch(validate(updateUserInfoSchema), updateUserInfo);

router.route("/account").patch(validate(updateAccountSchema), updateAccount);
router
  .route("/change-password")
  .patch(validate(changePasswordSchema), changePassword);

router.route("/calorie-goal").get(getCalorieGoal);
router.route("/account").delete(deleteAccount);

export default router;
