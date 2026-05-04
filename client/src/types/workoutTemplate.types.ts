export interface PopulatedExercise {
  _id: string;
  name: string;
  muscleGroup: string;
  category: string;
}

export interface TemplateExercise {
  exerciseId: string | PopulatedExercise;
  targetSets?: number;
  notes?: string;
}

export interface WorkoutTemplate {
  _id: string;
  name: string;
  userId: string;
  exercises: TemplateExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTemplates {
  templates: WorkoutTemplate[];
  page: number;
  limit: number;
  total: number;
}
