import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { createVolunteerAPI } from "../api";
import { Designation } from "../types";

export const useDesignationsById = () => {
  const axios = useAxios();
  const api = useMemo(() => createVolunteerAPI(axios), [axios]);

  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDesignationsByIds = useCallback(
    async (wingId: number | null, levelId: number | null) => {
      if (!wingId || !levelId) {
        setDesignations([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [wing, level] = await Promise.all([
          api.getWing(wingId),
          api.getLevel(levelId),
        ]);

        const levelName = Array.isArray(level.name) ? level.name[0] : level.name;

        const data = await api.getDesignations(
          levelName,
          wing.name
        );
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
        toast.error(errorMsg);
        setDesignations([]);
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return {
    designations,
    loading,
    error,
    fetchDesignationsByIds,
  };
};
