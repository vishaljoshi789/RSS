"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { Application, ApplicationFilters, PaginatedResponse } from "../types";

export function useApplications(filters?: ApplicationFilters) {
  const axios = useAxios();
  const api = createVolunteerAPI(axios);
  
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
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch applications";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [api, filters, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const createApplication = async (data: any) => {
    try {
      await api.createApplication(data);
      toast.success("Application submitted successfully");
      fetchApplications();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to submit application";
      toast.error(errorMessage);
      throw err;
    }
  };

  const updateApplication = async (id: number, data: any) => {
    try {
      await api.updateApplication(id, data);
      toast.success("Application updated successfully");
      fetchApplications();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update application";
      toast.error(errorMessage);
      throw err;
    }
  };

  const deleteApplication = async (id: number) => {
    try {
      await api.deleteApplication(id);
      toast.success("Application deleted successfully");
      fetchApplications();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete application";
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
