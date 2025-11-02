import { useState, useCallback } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { Level } from "../types";

export const useLevelsById = () => {
  const axios = useAxios();
  const api = createVolunteerAPI(axios);

  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLevelsByWingId = useCallback(async (wingId: number | null) => {
    if (!wingId) {
      setLevels([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const wing = await api.getWing(wingId);

      const data = await api.getLevels(wing.name);
      setLevels(data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to fetch levels";
      setError(errorMsg);
      toast.error(errorMsg);
      setLevels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    levels,
    loading,
    error,
    fetchLevelsByWingId,
  };
};
