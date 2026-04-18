import { IExercise } from "./workout.types.js";

export interface IExerciseService {
  createExercise(userId: string, dto: CreateExerciseDto): Promise<IExercise>;
  updateExercise(
    userId: string,
    exerciseId: string,
    dto: UpdateExerciseDto,
  ): Promise<IExercise | null>;
  deleteExercise(exerciseId: string, userId: string): Promise<void>;
  getExerciseById(exerciseId: string, userId: string): Promise<IExercise>;
  getAllExercise(userId: string): Promise<IExercise[]>;
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
