import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { Wing, WingFormData } from "../types";

export const useWings = () => {
  const axios = useAxios();
  const api = createVolunteerAPI(axios);

  const [wings, setWings] = useState<Wing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getWings();
      setWings(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to fetch wings";
      setError(errorMsg);
      console.error("Failed to fetch wings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createWing = useCallback(async (data: WingFormData) => {
    try {
      const newWing = await api.createWing(data);
      setWings((prev) => [...prev, newWing]);
      toast.success("Wing created successfully");
      return newWing;
    } catch (err: any) {
      console.error("Failed to create wing:", err);
      throw err;
    }
  }, []);

  const updateWing = useCallback(
    async (id: number, data: Partial<WingFormData>) => {
      try {
        const updatedWing = await api.updateWing(id, data);
        setWings((prev) =>
          prev.map((wing) => (wing.id === id ? updatedWing : wing))
        );
        toast.success("Wing updated successfully");
        return updatedWing;
      } catch (err: any) {
        console.error("Failed to update wing:", err);
        throw err;
      }
    },
    []
  );

  const deleteWing = useCallback(async (id: number) => {
    try {
      await api.deleteWing(id);
      setWings((prev) => prev.filter((wing) => wing.id !== id));
      toast.success("Wing deleted successfully");
    } catch (err: any) {
      console.error("Failed to delete wing:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchWings();
  }, [fetchWings]);

  return {
    wings,
    loading,
    error,
    refetch: fetchWings,
    createWing,
    updateWing,
    deleteWing,
  };
};
