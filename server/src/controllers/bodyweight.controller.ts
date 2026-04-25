import MongoBodyweightService from "../services/bodyweight.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const logBodyweight = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const loggedWeight = await MongoBodyweightService.logBodyweight(
    userId,
    req.body,
  );

  res
    .status(201)
    .json(new ApiResponse(201, loggedWeight, "Bodyweight logged successfully"));
});

export const getBodyweightHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id.toString();

  const history = await MongoBodyweightService.getBodyweightHistory(userId);

  res
    .status(200)
    .json(
      new ApiResponse(200, history, "Bodyweight history fetched successfully"),
    );
});

export const deleteBodyweightEntry = asyncHandler(async (req, res) => {
  const bodyweightId = req.params.bodyweightId as string;
  const userId = req.user._id.toString();

  await MongoBodyweightService.deleteBodyweightEntry(userId, bodyweightId);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Bodyweight entry deleted successfully"));
});
