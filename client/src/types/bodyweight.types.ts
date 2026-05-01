export interface IBodyweightLog {
  userId: string;
  weight: number;
  unit: "kg" | "lbs";
  date: string;
  notes?: string;
}

export interface PaginatedBodyweights {
  logs: IBodyweightLog[];
  total: number;
  page: number;
  totalPages: number;
}
