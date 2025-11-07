"use client";
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import { useRouter } from "next/navigation";
import {
  User,
  AuthContextType,
  LoginResponse,
  RegisterRequest,
  AuthState,
} from "@/types/auth.types";
import { getApiBaseUrl } from "@/lib/env";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  const isProduction = process.env.NODE_ENV === "production";
  const baseURL = getApiBaseUrl();

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    initialized: false,
  });

  const sameSitePolicy = isProduction ? "Strict" : "Lax";
  const secureAttribute = isProduction ? "; Secure" : "";

  const setAuthCookie = useCallback(
    (name: string, value: string) => {
      document.cookie = `${name}=${value}; Path=/; SameSite=${sameSitePolicy}${secureAttribute}`;
    },
    [sameSitePolicy, secureAttribute]
  );

  const clearAuthCookie = useCallback(
    (name: string) => {
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=${sameSitePolicy}${secureAttribute}`;
    },
    [sameSitePolicy, secureAttribute]
  );

  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers instanceof Headers
          ? Object.fromEntries(options.headers)
          : (options.headers as Record<string, string> || {})),
      };

      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      return fetch(`${baseURL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers,
      });
    },
    [baseURL]
  );

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setAuthState((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  }, []);

  const setUserData = useCallback((userData: User | { user_info: User }) => {
    const user: User = 'user_info' in userData ? userData.user_info : userData;

    localStorage.setItem("user_data", JSON.stringify({ user_info: user }));

    setAuthState((prev) => ({
      ...prev,
      user: user,
      isAuthenticated: true,
      loading: false,
      error: null,
      initialized: true,
    }));
  }, []);

  const refreshUserData = useCallback(async (): Promise<boolean> => {
    try {
      const response = await apiCall("/dashboard/");

      if (response.ok) {
        const data = await response.json();

        if (data && data.user_info) {
          localStorage.setItem("user_data", JSON.stringify(data));
          setUserData(data);
          return true;
        }
      }

      if (response.status !== 401) {
        console.error("Failed to refresh user data:", response.status);
      } else {
        console.warn("Token expired while refreshing user data (401)");
      }
      return false;
    } catch (error) {
      console.error("Error refreshing user data:", error);
      return false;
    }
  }, [apiCall, setUserData]);

  const createDefaultUser = useCallback(
    (): User => ({
      id: 1,
      user_id: "unknown",
      username: "user",
      name: "User",
      email: "user@example.com",
      phone: "",
      is_verified: false,
      is_blocked: false,
      is_volunteer: true,
      is_admin_account: false,
      is_business_account: false,
      is_staff_account: false,
      is_member_account: false,
      is_field_worker: false,
      is_staff: false,
      is_active: true,
      is_superuser: false,
      date_joined: new Date().toISOString(),
    }),
    []
  );

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshTokenValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refresh_token="))
        ?.split("=")[1];

      if (!refreshTokenValue) {
        console.log("No refresh token found");
        return false;
      }

      const response = await apiCall("/account/token/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh: refreshTokenValue }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuthCookie("access_token", data.access);

        console.log("Token refreshed successfully");
        return true;
      } else {
        clearAuthCookie("access_token");
        clearAuthCookie("refresh_token");
        return false;
      }
    } catch (error) {
      if(error instanceof Error) {
        console.error("Refresh token error:", error);
      }
      return false;
    }
  }, [apiCall, clearAuthCookie, setAuthCookie]);

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));

      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      const refreshTokenValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith("refresh_token="))
        ?.split("=")[1];

      if (!accessToken && !refreshTokenValue) {
        const storedUserData = localStorage.getItem("user_data");
        if (storedUserData) {
          console.log("No auth cookies found, removing stale user_data from localStorage");
          localStorage.removeItem("user_data");
        }
        
        setAuthState((prev) => ({
          ...prev,
          user: null,
          isAuthenticated: false,
          loading: false,
          initialized: true,
        }));
        return;
      }

      if (!accessToken && refreshTokenValue) {
        const refreshSuccessful = await refreshToken();
        if (refreshSuccessful) {
          await checkAuth();
        } else {
          localStorage.removeItem("user_data");
          setAuthState((prev) => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            loading: false,
            initialized: true,
          }));
        }
        return;
      }

      const response = await apiCall("/account/token/verify/", {
        method: "POST",
        body: JSON.stringify({ token: accessToken }),
      });

      if (response.ok) {
        const storedUserData = localStorage.getItem("user_data");
        let userData: User;

        if (storedUserData) {
          try {
            const parsedData = JSON.parse(storedUserData);
            userData = parsedData.user_info || parsedData;
          } catch (parseErr) {
            if (parseErr instanceof Error) {
              console.error("Error parsing stored user data:", parseErr);
            }
            localStorage.removeItem("user_data");
            userData = createDefaultUser();
          }
        } else {
          userData = createDefaultUser();
        }

        setAuthState((prev) => ({
          ...prev,
          user: userData,
          isAuthenticated: true,
          loading: false,
          error: null,
          initialized: true,
        }));
      } else {
        const refreshSuccessful = await refreshToken();

        if (refreshSuccessful) {
          await checkAuth();
        } else {
          setAuthState((prev) => ({
            ...prev,
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            initialized: true,
          }));
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Auth check error:", err);
      }
      setAuthState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        initialized: true,
      }));
    }
  }, [apiCall, createDefaultUser, refreshToken]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResponse> => {
      try {
        setAuthState((prev) => ({ ...prev, loading: true, error: null }));

        const response = await apiCall("/account/token/", {
          method: "POST",
          body: JSON.stringify({ username: email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setAuthCookie("access_token", data.access);
          setAuthCookie("refresh_token", data.refresh);

          try {
            const dashboardResponse = await apiCall("/dashboard/");
            const dashboardData = await dashboardResponse.json();

            if (dashboardResponse.ok && dashboardData.user_info) {
              localStorage.setItem("user_data", JSON.stringify(dashboardData));
              setUserData(dashboardData);
            } else {
              await checkAuth();
            }
          } catch (dashboardErr) {
            if (dashboardErr instanceof Error) {
              console.error("Error fetching dashboard data:", dashboardErr);
            }
            await checkAuth();
          }

          const redirectUrl =
            typeof window !== "undefined"
              ? localStorage.getItem("redirectAfterLogin")
              : null;

          if (redirectUrl) {
            localStorage.removeItem("redirectAfterLogin");
            router.push(redirectUrl);
          } else {
            router.push("/dashboard");
          }

          return {
            success: true,
            message: "Login successful",
          };
        } else {
          const errorMessage = data.detail || data.message || "Login failed";
          setAuthState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));

          return {
            success: false,
            message: errorMessage,
          };
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Login error:", err);
        }
        const errorMessage = "Network error. Please check your connection.";
        setAuthState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        return {
          success: false,
          message: errorMessage,
        };
      }
    },
    [apiCall, checkAuth, setUserData, router, setAuthCookie]
  );

  const register = useCallback(
    async (data: RegisterRequest): Promise<LoginResponse> => {
      try {
        const response = await apiCall("/account/join/", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (response.ok) {
          setAuthState((prev) => ({
            ...prev,
            error: null,
          }));

          return {
            success: true,
            message: "Registration successful. You can now login.",
          };
        } else {
          const errorMessage = responseData.error || "Registration failed";
          setAuthState((prev) => ({
            ...prev,
            error: errorMessage,
          }));

          return {
            success: false,
            message: errorMessage,
          };
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Registration error:", err);
        }
        const errorMessage = "Network error. Please try again.";
        setAuthState((prev) => ({
          ...prev,
          error: errorMessage,
        }));

        return {
          success: false,
          message: errorMessage,
        };
      }
    },
    [apiCall]
  );

  const logout = useCallback(() => {
    // apiCall("/account/logout/", { method: "POST" }).catch(() => {});

    clearAuthCookie("access_token");
    clearAuthCookie("refresh_token");

    localStorage.removeItem("user_data");
    localStorage.removeItem("redirectAfterLogin");

    localStorage.clear();

    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      initialized: true,
    });

    router.push("/auth/login");
  }, [router, clearAuthCookie]);

  const isAdmin = useCallback((): boolean => {
    return (
      authState.user?.is_admin_account || authState.user?.is_superuser || false
    );
  }, [authState.user]);

  const isStaff = useCallback((): boolean => {
    return (
      authState.user?.is_staff_account || authState.user?.is_staff || false
    );
  }, [authState.user]);

  const isVolunteer = useCallback((): boolean => {
    return authState.user?.is_volunteer || false;
  }, [authState.user]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      console.log("🔄 Auto-refreshing token...");
      const refreshSuccessful = await refreshToken();

      if (!refreshSuccessful) {
        console.log("❌ Auto-refresh failed, logging out");
        logout();
      } else {
        console.log("✅ Token auto-refreshed successfully");
      }
    }, 25 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [authState.isAuthenticated, refreshToken, logout]);

  const verifyToken = useCallback(
    async (token?: string): Promise<boolean> => {
      try {
        const accessToken =
          token ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("access_token="))
            ?.split("=")[1];

        if (!accessToken) {
          return false;
        }

        const response = await apiCall("/account/token/verify/", {
          method: "POST",
          body: JSON.stringify({ token: accessToken }),
        });

        return response.ok;
      } catch (err) {
        if (err instanceof Error) {
          console.error("Token verification error:", err);
        }
        return false;
      }
    },
    [apiCall]
  );

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
    setUserData,
    refreshUserData,
    clearError,
    checkAuth,
    verifyToken,
    isAdmin,
    isStaff,
    isVolunteer,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider };
