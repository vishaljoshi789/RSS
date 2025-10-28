import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";

export interface VolunteerStats {
  total_volunteers: number;
  total_wings: number;
  total_levels: number;
  total_designations: number;
  volunteers_by_wing: { wing_name: string; count: number }[];
  volunteers_by_level: { level_name: string; count: number }[];
}

export const useVolunteerStats = () => {
  const axios = useAxios();
  const api = createVolunteerAPI(axios);

  const [stats, setStats] = useState<VolunteerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVolunteerStats();
      
      // Transform the data to match our stats interface
      const transformedStats: VolunteerStats = {
        total_volunteers: data.total_volunteers,
        total_wings: Object.keys(data.by_wing).length,
        total_levels: Object.keys(data.by_level).length,
        total_designations: Object.keys(data.by_designation).length,
        volunteers_by_wing: Object.entries(data.by_wing).map(([wing_name, count]) => ({
          wing_name,
          count,
        })),
        volunteers_by_level: Object.entries(data.by_level).map(([level_name, count]) => ({
          level_name,
          count,
        })),
      };
      
      setStats(transformedStats);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch statistics";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};
