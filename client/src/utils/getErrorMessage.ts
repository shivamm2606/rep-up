import axios from "axios";
import type { ApiErrorResponse } from "../types/apiErrorResponse";

export const getErrorMessage = (err: unknown): string => {
  // all errors

  if (axios.isAxiosError<ApiErrorResponse>(err)) {
    return err.response?.data?.message ?? "API Error";
  }

  if (err instanceof Error) {
    return err.message;
  }

  if (typeof err === "string") {
    return err;
  }

  return "Something went wrong";
};
