export interface IStrengthSet {
  type: "strength";
  reps: number;
  weight: number;
  unit: "kg" | "lbs";
  isWarmup: boolean;
}

export interface ICardioSet {
  type: "cardio";
  duration: number;
  distance?: number;
  unit?: "km" | "mi";
  avgHeartRate?: number;
}

export interface IFlexibilitySet {
  type: "flexibility";
  duration: number;
}

export type ISetLog = IStrengthSet | ICardioSet | IFlexibilitySet;

export interface IExerciseLog {
  sets: ISetLog[];
  notes?: string;
  exerciseId: string;
}

export interface IWorkoutSession {
  userId: string;
  name?: string;
  date: string;
  status: "active" | "completed";
  exercises: IExerciseLog[];
  duration?: number;
  notes?: string;
  templateUsed?: string;
}

export interface PaginatedSessions {
  sessions: IWorkoutSession[];
  total: number;
  page: number;
  totalPages: number;
}
