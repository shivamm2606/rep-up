import User from "../models/user.model.js";
import {
  IUserService,
  UpdateUserInfoDto,
  ChangePasswordDto,
  UpdateAccountDto,
  ProfileResult,
} from "../types/user.types.js";
import { ApiError } from "../utils/apiError.js";

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

  updateUserInfo = async (
    userId: string,
    dto: UpdateUserInfoDto,
  ): Promise<ProfileResult> => {

    const updateFields: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) {
        updateFields[`userInfo.${key}`] = value;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true },
    );

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return {
      _id: updatedUser._id.toString(),
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      userInfo: updatedUser.userInfo,
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
}

export default new UserService();