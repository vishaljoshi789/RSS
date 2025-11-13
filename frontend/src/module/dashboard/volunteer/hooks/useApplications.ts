"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { Application, ApplicationFilters, ApplicationFormData, PaginatedResponse } from "../types";

export function useApplications(filters?: ApplicationFilters) {
  const axios = useAxios();
  const api = useMemo(() => createVolunteerAPI(axios), [axios]);
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data: PaginatedResponse<Application> = await api.getApplications(filters, page);
      setApplications(data.results);
      setCount(data.count);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error fetching applications:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse.response?.data?.message || "Failed to fetch applications";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api, filters, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const createApplication = async (data: ApplicationFormData) => {
    try {
      await api.createApplication(data);
      toast.success("Application submitted successfully");
      fetchApplications();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error creating application:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse.response?.data?.message || "Failed to submit application";
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateApplication = async (id: number, data: Partial<ApplicationFormData>) => {
    try {
      await api.updateApplication(id, data);
      toast.success("Application updated successfully");
      fetchApplications();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error updating application:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse.response?.data?.message || "Failed to update application";
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteApplication = async (id: number) => {
    try {
      await api.deleteApplication(id);
      toast.success("Application deleted successfully");
      fetchApplications();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error deleting application:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        errorResponse.response?.data?.message || "Failed to delete application";
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    applications,
    loading,
    error,
    page,
    setPage,
    totalPages,
    count,
    refresh: fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
  };
}
