import {
  IBodyweightLog,
  IBodyweightService,
  LogbodyweightDto,
} from "../types/bodyweight.types.js";
import { ApiError } from "../utils/apiError.js";
import Bodyweight from "../models/bodyweight.model.js";

class MongoBodyweightService implements IBodyweightService {
  logBodyweight = async (
    userId: string,
    dto: LogbodyweightDto,
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

  getBodyweightHistory = async (userId: string): Promise<IBodyweightLog[]> => {
    const bodyweights = await Bodyweight.find({ userId }).sort({ date: -1 });

    return bodyweights;
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
