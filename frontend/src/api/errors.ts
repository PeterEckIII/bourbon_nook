import { isAxiosError } from 'axios';

export interface ApiFieldError {
  field: string;
  rejectedValue: unknown;
  message: string;
}

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  errorCode: string;
  message: string;
  developerMessage: string;
  path: string;
  traceId: string;
  errors: ApiFieldError[];
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (isAxiosError<ApiErrorResponse>(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return fallback;
}
