import { Types } from "mongoose";

export interface IBodyweightLog {
  userId: Types.ObjectId;
  weight: number;
  unit: "kg" | "lbs";
  date: Date;
  notes?: string;
}

export interface IBodyweightService {
  logBodyweight(userId: string, dto: LogbodyweightDto): Promise<IBodyweightLog>;
  getBodyweightHistory(userId: string): Promise<IBodyweightLog[]>;
  deleteBodyweightEntry(userId: string, bodyweightId: string): Promise<void>;
}

export interface LogbodyweightDto {
  weight: number;
  unit: "kg" | "lbs";
  date?: Date;
  notes?: string;
}
