import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { Level, LevelFormData } from "../types";

export const useLevels = (wingName?: string) => {
  const axios = useAxios();
  const api = createVolunteerAPI(axios);

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getLevels(wingName);
      setLevels(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to fetch levels";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [wingName]);

  const createLevel = useCallback(async (data: LevelFormData) => {
    try {
      const payload: LevelFormData = {
        ...data,
        name: Array.isArray(data.name)
          ? data.name.map((n: any) =>
              typeof n === "string" ? n : n?.en ?? String(n)
            )
          : [String(data.name as any)],
      };

      const newLevel = await api.createLevel(payload);
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
      // Normalize name field to English-only if present
      let payload: Partial<LevelFormData> = { ...data };
      if (data.name) {
        payload = {
          ...payload,
          name: Array.isArray(data.name)
            ? data.name.map((n: any) => (typeof n === "string" ? n : n?.en ?? String(n)))
            : [String((data.name as any))],
        };
      }

      const updatedLevel = await api.updateLevel(id, payload);
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
