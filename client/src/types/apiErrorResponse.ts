export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  success: false;
  errors: unknown[];
  data: unknown;
}

export interface ApiSuccessResponse<T = unknown> {
  statusCode: number;
  message: string;
  success: true;
  data: T;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
