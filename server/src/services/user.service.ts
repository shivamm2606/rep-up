import User from "../models/user.model.js";
import WorkoutSession from "../models/workoutSession.model.js";
import WorkoutTemplate from "../models/workoutTemplate.model.js";
import Exercise from "../models/exercise.model.js";
import Bodyweight from "../models/bodyweight.model.js";
import {
  IUserService,
  UpdateUserInfoDto,
  ChangePasswordDto,
  UpdateAccountDto,
  ProfileResult,
} from "../types/user.types.js";
import { ApiError } from "../utils/apiError.js";
import { computeCalorieGoal } from "../utils/calorie.helper.js";
import { generateOTP, getOTPExpiry } from "../utils/otp.js";
import { sendEmail } from "../utils/mailer.js";

class UserService implements IUserService {
  getProfile = async (userId: string): Promise<ProfileResult> => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      userInfo: user.userInfo,
    };
  };

  updateUserInfo = async (userId: string, dto: UpdateUserInfoDto) => {
    const user = await User.findById(userId);

    if (!user || !user.userInfo) {
      throw new ApiError(404, "User not found");
    }

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        (user.userInfo as any)[key] = value;
      }
    }

    const info = user.userInfo;

    // manual
    if (!info.isCalorieGoalAutoCalculated && info.dailyCalorieGoal) {
      await user.save();
      return {
        _id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        userInfo: user.userInfo,
      };
    }

    const { height, currentWeight, gender, dateOfBirth, activityLevel, goal } =
      info;

    if (
      height &&
      currentWeight &&
      gender &&
      dateOfBirth &&
      activityLevel &&
      goal
    ) {
      const age = Math.floor(
        (Date.now() - dateOfBirth.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
      );

      const calories = computeCalorieGoal({
        height,
        currentWeight,
        gender,
        age,
        activityLevel,
        goal,
      });

      info.dailyCalorieGoal = calories;
      info.isCalorieGoalAutoCalculated = true;
    }

    await user.save();

    return {
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      userInfo: user.userInfo,
    };
  };

  updateAccount = async (
    userId: string,
    dto: UpdateAccountDto,
  ): Promise<ProfileResult> => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const { name, email, username } = dto;

    // Check for uniqueness conflicts
    const conflictFilters: any[] = [];
    if (email) conflictFilters.push({ email });
    if (username) conflictFilters.push({ username });

    if (conflictFilters.length > 0) {
      const existingUser = await User.findOne({ $or: conflictFilters });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new ApiError(400, "Email or username already in use");
      }
    }

    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;

    if (email !== undefined && email !== user.email) {
      user.email = email;
      user.isVerified = false;

      const otp = generateOTP();
      const otpExpiry = getOTPExpiry();
      user.otp = otp;
      user.otpExpiry = otpExpiry;

      await user.save();

      await sendEmail(
        email,
        "Verify your new email — RepUp",
        `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 8px;">
  <h2 style="color: #111;">Verify your new email</h2>
  <p style="color: #444;">You changed your email address. Use the OTP below to verify it.</p>
  <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111; background: #f5f5f5; padding: 16px; text-align: center; border-radius: 6px; margin: 24px 0;">
    ${otp}
  </div>
  <p style="color: #888; font-size: 13px;">This OTP expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
  <p style="color: #aaa; font-size: 12px;">If you didn't make this change, please secure your account immediately.</p>
</div>`,
      );
    } else {
      await user.save();
    }

    return {
      _id: user._id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      userInfo: user.userInfo,
    };
  };

  changePassword = async (
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<void> => {
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const { currentPassword, newPassword } = dto;

    const isCorrect = await user.isPasswordCorrect(currentPassword);

    if (!isCorrect) {
      throw new ApiError(400, "Invalid credentials");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: true });
  };

  getCalorieGoal = async (userId: string): Promise<number> => {
    const user = await User.findById(userId);

    if (!user || !user.userInfo) {
      throw new ApiError(404, "User not found");
    }

    const calories = user.userInfo.dailyCalorieGoal;

    if (!calories) {
      throw new ApiError(400, "Calorie goal not set yet");
    }

    return calories;
  };

  deleteAccount = async (userId: string): Promise<void> => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Cascade delete all user data
    await Promise.all([
      WorkoutSession.deleteMany({ userId }),
      WorkoutTemplate.deleteMany({ userId }),
      Exercise.deleteMany({ createdBy: userId, isCustom: true }),
      Bodyweight.deleteMany({ userId }),
    ]);

    await user.deleteOne();
  };
}

export default new UserService();
