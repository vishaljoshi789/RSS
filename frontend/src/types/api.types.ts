export interface ApiErrorResponse {
  message?: string;
  error?: string;
  detail?: string;
  [key: string]: unknown;
}

export interface ApiError {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
    statusText?: string;
  };
  message?: string;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
    if (apiError.response?.data?.error) {
      return apiError.response.data.error;
    }
    if (apiError.response?.data?.detail) {
      return apiError.response.data.detail;
    }
    if (apiError.message) {
      return apiError.message;
    }
  }
  
  return 'An unexpected error occurred';
}
