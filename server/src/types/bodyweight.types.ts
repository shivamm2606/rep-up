import { Types } from "mongoose";
import type { LogBodyweightDto } from "../validator/bodyweight.validator.js";

export type { LogBodyweightDto };

export interface IBodyweightLog {
  userId: Types.ObjectId;
  weight: number;
  unit: "kg" | "lbs";
  date: Date;
  notes?: string;
}

export interface IBodyweightService {
  logBodyweight(userId: string, dto: LogBodyweightDto): Promise<IBodyweightLog>;
  getBodyweightHistory(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    entries: IBodyweightLog[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  deleteBodyweightEntry(userId: string, bodyweightId: string): Promise<void>;
}
