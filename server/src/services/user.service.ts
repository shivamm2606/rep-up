import User from "../models/user.model.js";
import {
  IUserService,
  UpdateUserInfoDto,
  ChangePasswordDto,
  UpdateAccountDto,
  ProfileResult,
} from "../types/user.types.js";
import { ApiError } from "../utils/apiError.js";
import { computeCalorieGoal } from "../utils/calorie.helper.js";

class UserService implements IUserService {
  getProfile = async (userId: string): Promise<ProfileResult> => {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "user not found");
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

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser && existingUser._id.toString() !== userId) {
      throw new ApiError(400, "Email or username already in use");
    }

    const updateFields: Partial<UpdateAccountDto> = {};

    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (username !== undefined) updateFields.username = username;

    const updatedUser = (await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true },
    )) as InstanceType<typeof User> | null;

    if (!updatedUser) {
      throw new ApiError(500, "Update failed");
    }

    return {
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      userInfo: updatedUser.userInfo,
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
}

export default new UserService();
