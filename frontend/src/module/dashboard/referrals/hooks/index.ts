"use client";

import { useState, useEffect, useCallback } from "react";
import useAxios from "@/hooks/use-axios";

export interface ReferralData {
  total_referrals: number;
  referrals: any[];
}

export function useReferrals(userId?: string | number) {
  const [referralData, setReferralData] = useState<ReferralData>({
    total_referrals: 0,
    referrals: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();

  const fetchReferrals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get("/dashboard/referrals/");

      if (response.data) {
        const data = response.data;
        const referralsList = Array.isArray(data.results)
          ? data.results
          : Array.isArray(data.referrals)
          ? data.referrals
          : Array.isArray(data)
          ? data
          : [];

        setReferralData({
          total_referrals:
            data.total_referrals ?? data.count ?? referralsList.length ?? 0,
          referrals: referralsList,
        });
      }
    } catch (err: any) {
      console.error("Error fetching referrals:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch referrals"
      );
      setReferralData({ total_referrals: 0, referrals: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals();
  }, [fetchReferrals]);

  return {
    referralData,
    loading,
    error,
    refetch: fetchReferrals,
  };
}
