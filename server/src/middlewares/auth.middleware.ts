import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
    _id: string;
  };

  const user = await User.findById(decoded._id);

  if (!user) {
    throw new ApiError(401, "Invalid token");
  }

  req.user = user;

  next();
});
