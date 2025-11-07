"use client";

import { useState, useEffect, useCallback } from "react";
import { User } from "@/types/auth.types";
import useAxios from "@/hooks/use-axios";

interface PaginationData {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
}

export interface UserStats {
  total_user: number;
  verified_user: number;
  member_user: number;
  volunteer_user: number;
  business_user: number;
  staff_user: number;
  admin_user: number;
  blocked_user: number;
}

export interface searchUsersParams {
  search: string;
}

export function useUsers(page: number = 1, page_size: number = 30) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    count: 0,
    total_pages: 1,
    current_page: 1,
    next: null,
    previous: null,
  });
  const axios = useAxios();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/account/list/", {
        params: { page, page_size }
      });
      
      
      const userData = response.data;
      if (Array.isArray(userData)) {
        setUsers(userData);
        setPagination({
          count: userData.length,
          total_pages: 1,
          current_page: 1,
          next: null,
          previous: null,
        });
      } else if (userData && Array.isArray(userData.results)) {
        
        setUsers(userData.results);
        setPagination({
          count: userData.count || userData.results.length,
          total_pages: userData.total_pages || 1,
          current_page: userData.current_page || page,
          next: userData.next || null,
          previous: userData.previous || null,
        });
      } else if (userData && Array.isArray(userData.data)) {
        
        setUsers(userData.data);
        setPagination({
          count: userData.count || userData.data.length,
          total_pages: userData.total_pages || 1,
          current_page: userData.current_page || page,
          next: userData.next || null,
          previous: userData.previous || null,
        });
      } else {
        console.warn("Unexpected API response format:", userData);
        setUsers([]);
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching users:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse.response?.data?.message ||
        errorResponse.message ||
        "Failed to fetch users";
      setError(errorMessage);
      setUsers([]); 
    } finally {
      setLoading(false);
    }
  }, [page, page_size, axios]);


  const updateUser = async (userId: number, data: Partial<User>) => {
    try {
      const response = await axios.put(`/account/detail/${userId}/`, data);
      
      setUsers(prevUsers => 
        prevUsers.map((user) => user.id === userId ? { ...user, ...response.data } : user)
      );
      return { success: true, message: "User updated successfully", data: response.data };
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error updating user:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse.response?.data?.message ||
        errorResponse.message ||
        "Failed to update user";
      return { success: false, error: errorMessage };
    }
  };

  const searchUser = async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("/account/list/", {
        params: { 
          search: searchTerm,
          page,
          page_size 
        }
      });
      
      const userData = response.data;
      
      if (Array.isArray(userData)) {
        setUsers(userData);
        setPagination({
          count: userData.length,
          total_pages: 1,
          current_page: 1,
          next: null,
          previous: null,
        });
      } else if (userData && Array.isArray(userData.results)) {
        setUsers(userData.results);
        setPagination({
          count: userData.count || userData.results.length,
          total_pages: userData.total_pages || 1,
          current_page: userData.current_page || page,
          next: userData.next || null,
          previous: userData.previous || null,
        });
      } else if (userData && Array.isArray(userData.data)) {
        setUsers(userData.data);
        setPagination({
          count: userData.count || userData.data.length,
          total_pages: userData.total_pages || 1,
          current_page: userData.current_page || page,
          next: userData.next || null,
          previous: userData.previous || null,
        });
      } else {
        console.warn("Unexpected search response format:", userData);
        setUsers([]);
      }
      
      return { success: true, message: "Search completed successfully" };
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error searching users:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse.response?.data?.message ||
        errorResponse.message ||
        "Failed to search users";
      setError(errorMessage);
      setUsers([]);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    refetch: fetchUsers,
    updateUser,
    searchUser,
  };
}

export function useUserById(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/account/detail/${userId}/`);
      setUser(response.data);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching user:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse.response?.data?.message ||
        errorResponse.message ||
        "Failed to fetch user";
      setError(errorMessage);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId, axios]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const axios = useAxios();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/dashboard/user-count/`);
      setStats(response.data);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching user stats:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse.response?.data?.message ||
        errorResponse.message ||
        "Failed to fetch user stats";
      console.error("Error fetching user stats:", errorMessage);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
}