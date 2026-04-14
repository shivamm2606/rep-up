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
  const result = await UserService.updateUserInfo(
    req.user._id.toString(),
    req.body,
  );

  res
    .status(200)
    .json(new ApiResponse(200, result, "User info updated successfully"));
});

export const updateAccount = asyncHandler(async (req, res) => {
  const result = await UserService.updateAccount(
    req.user._id.toString(),
    req.body,
  );

  res
    .status(200)
    .json(new ApiResponse(200, result, "Account details updated successfully"));
});

export const changePassword = asyncHandler(async (req, res) => {
  await UserService.changePassword(req.user._id.toString(), req.body);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});
