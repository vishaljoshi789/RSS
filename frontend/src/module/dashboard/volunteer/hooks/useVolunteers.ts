import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { DesignationCombination, VolunteerFormData, VolunteerFilters } from "../types";

export const useVolunteers = (initialFilters?: VolunteerFilters) => {
  const axios = useAxios();
  const api = createVolunteerAPI(axios);

  const [volunteers, setVolunteers] = useState<DesignationCombination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<VolunteerFilters>(
    initialFilters || {}
  );
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const fetchVolunteers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVolunteers(filters, page);
      setVolunteers(data.results);
      setTotalCount(data.count);
      setHasNext(!!data.next);
      setHasPrevious(!!data.previous);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch designation combinations";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  const createVolunteer = useCallback(async (data: VolunteerFormData) => {
    try {
      const newVolunteer = await api.createVolunteer(data);
      toast.success("Volunteer assigned successfully");
      // Refetch to update the list
      fetchVolunteers();
      return newVolunteer;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to assign volunteer";
      toast.error(errorMsg);
      throw err;
    }
  }, [fetchVolunteers]);

  const updateVolunteer = useCallback(
    async (id: number, data: Partial<VolunteerFormData>) => {
      try {
        const updatedVolunteer = await api.updateVolunteer(id, data);
        toast.success("Volunteer updated successfully");
        // Refetch to update the list
        fetchVolunteers();
        return updatedVolunteer;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || "Failed to update volunteer";
        toast.error(errorMsg);
        throw err;
      }
    },
    [fetchVolunteers]
  );

  const deleteVolunteer = useCallback(async (id: number) => {
    try {
      await api.deleteVolunteer(id);
      toast.success("Volunteer removed successfully");
      // Refetch to update the list
      fetchVolunteers();
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to remove volunteer";
      toast.error(errorMsg);
      throw err;
    }
  }, [fetchVolunteers]);

  const updateFilters = useCallback((newFilters: VolunteerFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  }, []);

  const nextPage = useCallback(() => {
    if (hasNext) setPage((prev) => prev + 1);
  }, [hasNext]);

  const previousPage = useCallback(() => {
    if (hasPrevious) setPage((prev) => prev - 1);
  }, [hasPrevious]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  return {
    volunteers,
    loading,
    error,
    filters,
    page,
    totalCount,
    hasNext,
    hasPrevious,
    refetch: fetchVolunteers,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer,
    updateFilters,
    nextPage,
    previousPage,
  };
};
