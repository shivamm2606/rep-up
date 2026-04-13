import MongoAuthService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

export const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const result = await MongoAuthService.registerUser(req.body);
  res.status(201).json(new ApiResponse(201, result, "User registered Successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const result = await MongoAuthService.loginUser(req.body);

  res.cookie("accessToken", result.accessToken, cookieOptions);
  res.cookie("refreshToken", result.refreshToken, cookieOptions);

  res
    .status(200)
    .json(new ApiResponse(200, result.user, "User logged in Successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  await MongoAuthService.logoutUser(req.user._id.toString());

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json(new ApiResponse(200, {}, "User logged out"));
});
