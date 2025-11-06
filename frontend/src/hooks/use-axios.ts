"use client";
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useCallback, useMemo } from "react";
import { getApiBaseUrl } from "@/lib/env";

interface ApiError {
  message: string;
  status: number;
  data?: any;
}

const useAxios = (): AxiosInstance => {
  const { refreshToken, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const baseURL = getApiBaseUrl();

  const axiosInstance: AxiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return instance;
  }, [baseURL]);

  const handleRequestError = useCallback((error: any) => {
    console.error("Request setup error:", error);
    toast.error("Request configuration error");
    return Promise.reject(error);
  }, []);

  const handleResponse = useCallback((response: AxiosResponse) => {
    return response;
  }, []);

  const handleResponseError = useCallback(
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        isAuthenticated
      ) {
        originalRequest._retry = true;

        try {
          const refreshSuccessful = await refreshToken();

          if (refreshSuccessful && originalRequest) {
            const newAccessToken = document.cookie
              .split("; ")
              .find((row) => row.startsWith("access_token="))
              ?.split("=")[1];

            if (newAccessToken) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            return axiosInstance(originalRequest);
          } else {
            logout();
            return Promise.reject(new Error("Authentication failed"));
          }
        } catch (refreshError) {
          console.error("Refresh error details:", refreshError);
          logout();
          return Promise.reject(new Error("Authentication failed"));
        }
      }

      const apiError: ApiError = {
        message: "An error occurred",
        status: error.response?.status || 0,
        data: error.response?.data,
      };

      // Debug logging
      console.log('[API Error] Status:', error.response?.status, 'Data:', error.response?.data);

      switch (error.response?.status) {
        case 400:
          const errorData = error.response.data as any;

          if (
            errorData &&
            typeof errorData === "object" &&
            !errorData.message &&
            !errorData.detail
          ) {
            let hasFieldErrors = false;

            Object.keys(errorData).forEach((field) => {
              const fieldErrors = errorData[field];
              if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                hasFieldErrors = true;
                fieldErrors.forEach((msg: string) => {
                  const fieldName =
                    field.charAt(0).toUpperCase() +
                    field.slice(1).replace(/_/g, " ");
                  toast.error(`${fieldName}: ${msg}`);
                });
              } else if (typeof fieldErrors === "string") {
                hasFieldErrors = true;
                const fieldName =
                  field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/_/g, " ");
                toast.error(`${fieldName}: ${fieldErrors}`);
              }
            });

            if (!hasFieldErrors) {
              apiError.message =
                errorData.message || errorData.detail || "Bad request";
              toast.error(apiError.message);
            }
          } else {
            apiError.message =
              errorData?.message || errorData?.detail || "Bad request";
            toast.error(apiError.message);
          }
          break;

        case 401:
          apiError.message = "Unauthorized access";
          if (isAuthenticated) {
            logout();
            toast.error("Session expired. Please login again.");
          }
          break;

        case 403:
          apiError.message = "Access forbidden";
          toast.error("You do not have permission to perform this action");
          break;

        case 404:
          apiError.message = "Resource not found";
          toast.error("Requested resource not found");
          break;

        case 422:
          apiError.message = "Validation error";
          if ((error.response.data as any)?.errors) {
            const validationErrors = (error.response.data as any).errors;
            Object.keys(validationErrors).forEach((field) => {
              toast.error(`${field}: ${validationErrors[field][0]}`);
            });
          } else {
            toast.error(apiError.message);
          }
          break;

        case 429:
          apiError.message = "Too many requests";
          toast.error("Too many requests. Please try again later.");
          break;

        case 500:
          apiError.message = "Internal server error";
          toast.error("Server error. Please try again later.");
          break;

        case 502:
        case 503:
        case 504:
          apiError.message = "Service unavailable";
          toast.error(
            "Service temporarily unavailable. Please try again later."
          );
          break;

        default:
          if (error.code === "ECONNABORTED") {
            apiError.message = "Request timeout";
            toast.error("Request timeout. Please try again.");
          } else if (error.message === "Network Error") {
            apiError.message = "Network error";
            toast.error("Network error. Please check your connection.");
          } else {
            const errorData = error.response?.data as any;
            if (errorData && typeof errorData === 'object') {
              const hasFieldErrors = Object.keys(errorData).some(key => 
                Array.isArray(errorData[key]) || typeof errorData[key] === 'string'
              );
              
              
            } 
          }
          break;
      }

      return Promise.reject(apiError);
    },
    [refreshToken, logout, isAuthenticated, router, axiosInstance]
  );

  useMemo(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
      },
      handleRequestError
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      handleResponse,
      handleResponseError
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [axiosInstance, handleRequestError, handleResponse, handleResponseError]);

  return axiosInstance;
};

export default useAxios;

export type { ApiError };
