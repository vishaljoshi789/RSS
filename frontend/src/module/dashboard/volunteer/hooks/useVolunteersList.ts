import { useCallback, useEffect, useState } from "react";
import useAxios from "@/hooks/use-axios";
import { VolunteerWithUser } from "../types";

interface PaginatedVolunteersResponse {
  count: number;
  total_pages?: number;
  current_page?: number;
  next: string | null;
  previous: string | null;
  results: VolunteerWithUser[];
}

export const useVolunteersList = () => {
  const axios = useAxios();
  const [volunteers, setVolunteers] = useState<VolunteerWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<PaginatedVolunteersResponse | VolunteerWithUser[]>(
        "/volunteer/volunteers/"
      );

      const data = res.data;
      const list: VolunteerWithUser[] = Array.isArray(data)
        ? data
        : data.results ?? [];

      setVolunteers(list || []);
    } catch (err) {
      console.error("Failed to fetch volunteers:", err);
      setError("Failed to load volunteers");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  return { volunteers, loading, error, refetch: fetchVolunteers };
};
