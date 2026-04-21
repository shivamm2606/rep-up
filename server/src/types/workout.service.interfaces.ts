import { IExercise, IWorkoutTemplate } from "./workout.types.js";

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
