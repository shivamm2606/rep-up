import {
  IBodyweightLog,
  IBodyweightService,
  LogBodyweightDto,
} from "../types/bodyweight.types.js";
import { ApiError } from "../utils/apiError.js";
import Bodyweight from "../models/bodyweight.model.js";

class MongoBodyweightService implements IBodyweightService {
  logBodyweight = async (
    userId: string,
    dto: LogBodyweightDto,
  ): Promise<IBodyweightLog> => {
    const { weight, unit, date, notes } = dto;

    const loggedWeight = await Bodyweight.create({
      userId,
      weight,
      unit,
      date: date ?? new Date(),
      notes,
    });

    return loggedWeight;
  };

  getBodyweightHistory = async (
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    entries: IBodyweightLog[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const skip = (page - 1) * limit;

    const [entries, total] = await Promise.all([
      Bodyweight.find({ userId }).sort({ date: -1 }).skip(skip).limit(limit),
      Bodyweight.countDocuments({ userId }),
    ]);

    return { entries, total, page, totalPages: Math.ceil(total / limit) };
  };

  deleteBodyweightEntry = async (
    userId: string,
    bodyweightId: string,
  ): Promise<void> => {
    const deleted = await Bodyweight.findOneAndDelete({
      _id: bodyweightId,
      userId,
    });

    if (!deleted) {
      throw new ApiError(404, "Entry not found");
    }

    return;
  };
}

export default new MongoBodyweightService();
