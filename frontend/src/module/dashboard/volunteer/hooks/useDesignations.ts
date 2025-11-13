import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { Designation, DesignationFormData } from "../types";

export const useDesignations = (levelName?: string, wingName?: string) => {
  const axios = useAxios();
  const api = useMemo(() => createVolunteerAPI(axios), [axios]);

  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDesignations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDesignations(levelName, wingName);
      setDesignations(data);
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to fetch designations:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMsg =
        errorResponse.response?.data?.message || "Failed to fetch designations";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelName, wingName]);

  const createDesignation = useCallback(async (data: DesignationFormData) => {
    try {
      const newDesignation = await api.createDesignation(data);
      setDesignations((prev) => [...prev, newDesignation]);
      toast.success("Designation created successfully");
      return newDesignation;
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to create designation:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      console.error("Failed to create designation:", errorResponse);
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } catch (err) {
        if (err instanceof Error) {
          console.error("Failed to update designation:", err);
        }
        const errorResponse = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        console.error("Failed to update designation:", errorResponse);
        throw err;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const deleteDesignation = useCallback(async (id: number) => {
    try {
      await api.deleteDesignation(id);
      setDesignations((prev) =>
        prev.filter((designation) => designation.id !== id)
      );
      toast.success("Designation deleted successfully");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to delete designation:", err);
      }
      const errorResponse = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      console.error("Failed to delete designation:", errorResponse);
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
