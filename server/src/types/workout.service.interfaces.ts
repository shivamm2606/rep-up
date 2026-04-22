import {
  IExercise,
  IWorkoutTemplate,
  IWorkoutSession,
} from "./workout.types.js";

export interface IExerciseService {
  createExercise(userId: string, dto: CreateExerciseDto): Promise<IExercise>;
  updateExercise(
    userId: string,
    exerciseId: string,
    dto: UpdateExerciseDto,
  ): Promise<IExercise | null>;
  deleteExercise(exerciseId: string, userId: string): Promise<void>;
  getExerciseById(exerciseId: string, userId: string): Promise<IExercise>;
  getAllExercises(userId: string): Promise<IExercise[]>;
}

export interface CreateExerciseDto {
  name: string;
  category: string;
  muscleGroup: string;
}

export interface UpdateExerciseDto {
  name?: string;
  category?: string;
  muscleGroup?: string;
}
export interface IWorkoutTemplateService {
  createTemplate(
    userId: string,
    dto: CreateWorkoutTemplateDto,
  ): Promise<IWorkoutTemplate>;
  updateTemplate(
    templateId: string,
    userId: string,
    dto: UpdateWorkoutTemplateDto,
  ): Promise<IWorkoutTemplate | null>;
  deleteTemplate(templateId: string, userId: string): Promise<void>;
  getTemplateById(
    templateId: string,
    userId: string,
  ): Promise<IWorkoutTemplate>;
  getAllTemplates(userId: string): Promise<IWorkoutTemplate[]>;
}

export interface CreateWorkoutTemplateDto {
  name: string;
  exercises: {
    exerciseId: string;
    targetSets?: number;
    notes?: string;
  }[];
}

export interface UpdateWorkoutTemplateDto {
  name?: string;
  exercises?: {
    exerciseId: string;
    targetSets?: number;
    notes?: string;
  }[];
}
export interface IWorkoutSessionService {
  createSession(
    userId: string,
    dto: CreateSessionDto,
  ): Promise<IWorkoutSession>;

  getSessionById(
    sessionId: string,
    userId: string,
  ): Promise<IWorkoutSession | null>;

  getUserSessions(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    sessions: IWorkoutSession[];
    total: number;
    page: number;
    limit: number;
  }>;

  addExerciseToSession(
    sessionId: string,
    userId: string,
    dto: AddExerciseToSessionDto,
  ): Promise<IWorkoutSession>;

  logSet(
    sessionId: string,
    userId: string,
    dto: LogSetDto,
  ): Promise<IWorkoutSession>;

  completeSession(sessionId: string, userId: string): Promise<IWorkoutSession>;

  deleteSession(sessionId: string, userId: string): Promise<void>;
}

export interface CreateSessionDto {
  templateUsed?: string;
  notes?: string;
}

export interface AddExerciseToSessionDto {
  exerciseId: string;
  notes?: string;
}

export type LogSetDto =
  | {
      exerciseId: string;
      type: "strength";
      reps: number;
      weight: number;
      unit?: "kg" | "lbs";
      isWarmup?: boolean;
      notes?: string;
    }
  | {
      exerciseId: string;
      type: "cardio";
      duration: number;
      distance?: number;
      notes?: string;
    }
  | {
      exerciseId: string;
      type: "flexibility";
      duration: number;
      notes?: string;
    };
