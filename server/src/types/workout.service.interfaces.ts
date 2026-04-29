import {
  IExercise,
  IWorkoutTemplate,
  IWorkoutSession,
} from "./workout.types.js";

import type {
  CreateExerciseDto,
  UpdateExerciseDto,
  GetExercisesDto,
} from "../validator/exercise.validator.js";

import type {
  CreateWorkoutTemplateDto,
  UpdateWorkoutTemplateDto,
} from "../validator/workoutTemplate.validator.js";

import type {
  CreateSessionDto,
  AddExerciseToSessionDto,
  LogSetDto,
} from "../validator/workoutSession.validator.js";

export type {
  CreateExerciseDto,
  UpdateExerciseDto,
  GetExercisesDto,
  CreateWorkoutTemplateDto,
  UpdateWorkoutTemplateDto,
  CreateSessionDto,
  AddExerciseToSessionDto,
  LogSetDto,
};

export interface IExerciseService {
  createExercise(userId: string, dto: CreateExerciseDto): Promise<IExercise>;
  updateExercise(
    exerciseId: string,
    userId: string,
    dto: UpdateExerciseDto,
  ): Promise<IExercise | null>;
  deleteExercise(exerciseId: string, userId: string): Promise<void>;
  getExerciseById(exerciseId: string, userId: string): Promise<IExercise>;
  getAllExercises(
    userId: string,
    filters: GetExercisesDto,
  ): Promise<PaginatedExercisesResponse>;
}

export interface PaginatedExercisesResponse {
  exercises: IExercise[];
  total: number;
  page: number;
  totalPages: number;
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
    totalPages: number;
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

  removeExerciseFromSession(
    sessionId: string,
    userId: string,
    exerciseId: string,
  ): Promise<IWorkoutSession>;

  removeSetFromSession(
    sessionId: string,
    userId: string,
    exerciseId: string,
    setIndex: number,
  ): Promise<IWorkoutSession>;
}
