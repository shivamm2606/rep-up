import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (user.role !== "admin") {
    throw new ApiError(403, "Forbidden: Admins only");
  }

  next();
});
