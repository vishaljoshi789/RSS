import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { User } from "../types";

export const useUsers = (search?: string) => {
  const axios = useAxios();
  const api = useMemo(() => createVolunteerAPI(axios), [axios]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getUsers(page, search);
      setUsers(data.results);
      setTotalCount(data.count);
      setHasNext(!!data.next);
      setHasPrevious(!!data.previous);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching users:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg =
        errorResponse.response?.data?.message || "Failed to fetch users";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [page, search, api]);

  const nextPage = useCallback(() => {
    if (hasNext) setPage((prev) => prev + 1);
  }, [hasNext]);

  const previousPage = useCallback(() => {
    if (hasPrevious) setPage((prev) => prev - 1);
  }, [hasPrevious]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    page,
    totalCount,
    hasNext,
    hasPrevious,
    refetch: fetchUsers,
    nextPage,
    previousPage,
  };
};
