import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { Designation, DesignationFormData } from "../types";

export const useDesignations = (levelName?: string, wingName?: string) => {
  const axios = useAxios();
  const api = createVolunteerAPI(axios);

  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDesignations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDesignations(levelName, wingName);
      setDesignations(data);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch designations";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [levelName, wingName]);

  const createDesignation = useCallback(async (data: DesignationFormData) => {
    try {
      const newDesignation = await api.createDesignation(data);
      setDesignations((prev) => [...prev, newDesignation]);
      toast.success("Designation created successfully");
      return newDesignation;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to create designation";
      toast.error(errorMsg);
      throw err;
    }
  }, []);

  const updateDesignation = useCallback(
    async (id: number, data: Partial<DesignationFormData>) => {
      try {
        const updatedDesignation = await api.updateDesignation(id, data);
        setDesignations((prev) =>
          prev.map((designation) =>
            designation.id === id ? updatedDesignation : designation
          )
        );
        toast.success("Designation updated successfully");
        return updatedDesignation;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || "Failed to update designation";
        toast.error(errorMsg);
        throw err;
      }
    },
    []
  );

  const deleteDesignation = useCallback(async (id: number) => {
    try {
      await api.deleteDesignation(id);
      setDesignations((prev) =>
        prev.filter((designation) => designation.id !== id)
      );
      toast.success("Designation deleted successfully");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to delete designation";
      toast.error(errorMsg);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  return {
    designations,
    loading,
    error,
    refetch: fetchDesignations,
    createDesignation,
    updateDesignation,
    deleteDesignation,
  };
};
