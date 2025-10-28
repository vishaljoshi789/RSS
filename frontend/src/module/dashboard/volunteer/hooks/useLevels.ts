import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { Level, LevelFormData } from "../types";

export const useLevels = (wingId?: number) => {
  const axios = useAxios();
  const api = createVolunteerAPI(axios);

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getLevels(wingId);
      setLevels(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to fetch levels";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [wingId]);

  const createLevel = useCallback(async (data: LevelFormData) => {
    try {
      const newLevel = await api.createLevel(data);
      setLevels((prev) => [...prev, newLevel]);
      toast.success("Level created successfully");
      return newLevel;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to create level";
      toast.error(errorMsg);
      throw err;
    }
  }, []);

  const updateLevel = useCallback(
    async (id: number, data: Partial<LevelFormData>) => {
      try {
        const updatedLevel = await api.updateLevel(id, data);
        setLevels((prev) =>
          prev.map((level) => (level.id === id ? updatedLevel : level))
        );
        toast.success("Level updated successfully");
        return updatedLevel;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || "Failed to update level";
        toast.error(errorMsg);
        throw err;
      }
    },
    []
  );

  const deleteLevel = useCallback(async (id: number) => {
    try {
      await api.deleteLevel(id);
      setLevels((prev) => prev.filter((level) => level.id !== id));
      toast.success("Level deleted successfully");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to delete level";
      toast.error(errorMsg);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  return {
    levels,
    loading,
    error,
    refetch: fetchLevels,
    createLevel,
    updateLevel,
    deleteLevel,
  };
};
