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
  getBodyweightHistory(userId: string): Promise<IBodyweightLog[]>;
  deleteBodyweightEntry(userId: string, bodyweightId: string): Promise<void>;
}
