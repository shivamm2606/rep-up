import UserService from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getProfile = asyncHandler(async (req, res) => {
  const result = await UserService.getProfile(req.user._id.toString());

  res
    .status(200)
    .json(new ApiResponse(200, result, "User fetched successfully"));
});

export const updateUserInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const result = await UserService.updateUserInfo(userId, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, result, "User info updated successfully"));
});

export const updateAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const result = await UserService.updateAccount(userId, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Account details updated successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  await UserService.changePassword(userId, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

export const getCalorieGoal = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const calories = await UserService.getCalorieGoal(userId);

  res.json(
    new ApiResponse(200, { calories }, "Calorie goal fetched successfully"),
  );
});
