"use client";
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  User,
  AuthTokens,
  AuthContextType,
  LoginResponse,
  RegisterRequest,
  AuthState,
} from "@/types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  const isProduction = process.env.NODE_ENV === "production";
  const baseURL = isProduction
    ? process.env.NEXT_PUBLIC_API_URL || "https://api.rss.org"
    : process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    initialized: false,
  });

  const apiCall = useCallback(
    async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
      return fetch(`${baseURL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
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

  const setUserData = useCallback((userData: User) => {
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    setAuthState((prev) => ({
      ...prev,
      user: userData,
      isAuthenticated: true,
      loading: false,
      error: null,
      initialized: true,
    }));
  }, []);

  // Default user data factory
  const createDefaultUser = useCallback((): User => ({
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
    is_staff: false,
    is_active: true,
    is_superuser: false,
    date_joined: new Date().toISOString(),
  }), []);

  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true }));

      const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];

      if (!accessToken) {
        const storedUserData = localStorage.getItem('user_data');
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            setAuthState((prev) => ({
              ...prev,
              user: userData,
              isAuthenticated: false,
              loading: false,
              initialized: true,
            }));
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            localStorage.removeItem('user_data');
          }
        } else {
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
        const storedUserData = localStorage.getItem('user_data');
        let userData: User;
        
        if (storedUserData) {
          try {
            userData = JSON.parse(storedUserData);
          } catch (error) {
            console.error('Error parsing stored user data:', error);
            localStorage.removeItem('user_data');
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
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        initialized: true,
      }));
    }
  }, [apiCall, createDefaultUser]);

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
          document.cookie = `access_token=${data.access}; path=/; secure; samesite=strict`;
          document.cookie = `refresh_token=${data.refresh}; path=/; secure; samesite=strict`;

          await checkAuth();

          router.push("/dashboard");

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
      } catch (error) {
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
    [apiCall, checkAuth, router]
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
      } catch (error) {
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

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const refreshTokenValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('refresh_token='))
        ?.split('=')[1];

      if (!refreshTokenValue) {
        console.log('No refresh token found');
        return false;
      }

      const response = await apiCall("/account/token/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh: refreshTokenValue }),
      });

      if (response.ok) {
        const data = await response.json();
        document.cookie = `access_token=${data.access}; path=/; secure; samesite=strict`;
        
        console.log('Token refreshed successfully');
        return true;
      } else {
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        return false;
      }
    } catch (error) {
      console.error('Refresh token error:', error);
      return false;
    }
  }, [apiCall]);

  const logout = useCallback(() => {
    apiCall("/account/logout/", { method: "POST" }).catch(() => {});

    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    localStorage.removeItem('user_data');

    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      initialized: true,
    });

    router.push("/auth/login");
  }, [apiCall, router]);

  const isAdmin = useCallback((): boolean => {
    return authState.user?.is_admin_account || authState.user?.is_superuser || false;
  }, [authState.user]);

  const isStaff = useCallback((): boolean => {
    return authState.user?.is_staff_account || authState.user?.is_staff || false;
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
      console.log('🔄 Auto-refreshing token...');
      const refreshSuccessful = await refreshToken();
      
      if (!refreshSuccessful) {
        console.log('❌ Auto-refresh failed, logging out');
        logout();
      } else {
        console.log('✅ Token auto-refreshed successfully');
      }
    }, 25 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [authState.isAuthenticated, refreshToken, logout]);

  const verifyToken = useCallback(async (token?: string): Promise<boolean> => {
    try {
      const accessToken = token || document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];

      if (!accessToken) {
        return false;
      }

      const response = await apiCall("/account/token/verify/", {
        method: "POST",
        body: JSON.stringify({ token: accessToken }),
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }, [apiCall]);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
    setUserData,
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

export { AuthContext, AuthProvider };
