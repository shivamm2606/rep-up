export interface TemplateExercise {
  exerciseId: string;
  targetSets?: number;
  notes?: string;
}

export interface WorkoutTemplate {
  _id: string;
  name: string;
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
