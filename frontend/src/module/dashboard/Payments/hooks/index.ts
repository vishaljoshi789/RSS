"use client";

import { useState, useEffect, useCallback } from "react";
import useAxios from "@/hooks/use-axios";

export interface Payment {
  id: number;
  name: string;
  email: string;
  phone: string;
  amount: number;
  timestamp: string;
  payment_for: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  notes: string | null;
  order_id: string;
  payment_id: string;
  method: string | null;
  payment_details: {
    payment_id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    method_details: {
      card?: {
        network: string | null;
        type: string | null;
        last4: string | null;
        issuer: string | null;
      } | null;
      upi?: {
        vpa: string | null;
      } | null;
      netbanking?: {
        bank: string | null;
      } | null;
      wallet?: {
        wallet: string | null;
      } | null;
    };
    acquirer_data: {
      bank_transaction_id: string | null;
      rrn: string | null;
      auth_code: string | null;
      upi_transaction_id: string | null;
    };
    contact: string | null;
    email: string | null;
    description: string | null;
    notes: any;
    created_at: number;
    fee: number | null;
    tax: number | null;
  } | null;
}

interface PaginationData {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
}

type PaymentsQuery = {
  search?: string;
  status?: string;
  payment_for?: string;
  method?: string;
};

const normalizePayment = (payment: any): Payment => ({
  id: Number(payment.id),
  name: payment.name ?? "",
  email: payment.email ?? "",
  phone: payment.phone ?? "",
  amount: Number(payment.amount ?? 0),
  timestamp: payment.timestamp ?? "",
  payment_for: payment.payment_for ?? "",
  status: (payment.status ?? "PENDING") as Payment["status"],
  notes: payment.notes ?? null,
  order_id: payment.order_id ?? "",
  payment_id: payment.payment_id ?? "",
  method: payment.method ?? null,
  payment_details: payment.payment_details
    ? {
        ...payment.payment_details,
        amount: Number(payment.payment_details.amount ?? payment.amount ?? 0),
      }
    : null,
});

const extractPayments = (
  data: any,
  fallbackPage: number
): { items: Payment[]; meta: PaginationData } => {
  const emptyMeta: PaginationData = {
    count: 0,
    total_pages: 1,
    current_page: fallbackPage,
    next: null,
    previous: null,
  };

  if (!data) {
    return { items: [], meta: emptyMeta };
  }

  if (Array.isArray(data)) {
    return {
      items: data.map(normalizePayment),
      meta: {
        count: data.length,
        total_pages: 1,
        current_page: fallbackPage,
        next: null,
        previous: null,
      },
    };
  }

  if (Array.isArray(data.results)) {
    return {
      items: data.results.map(normalizePayment),
      meta: {
        count: Number(data.count ?? data.results.length ?? 0),
        total_pages: Number(data.total_pages ?? 1),
        current_page: Number(data.current_page ?? fallbackPage),
        next: data.next ?? null,
        previous: data.previous ?? null,
      },
    };
  }

  if (Array.isArray(data.data)) {
    return {
      items: data.data.map(normalizePayment),
      meta: {
        count: Number(data.count ?? data.data.length ?? 0),
        total_pages: Number(data.total_pages ?? 1),
        current_page: Number(data.current_page ?? fallbackPage),
        next: data.next ?? null,
        previous: data.previous ?? null,
      },
    };
  }

  console.warn("Unexpected API response format:", data);
  return { items: [], meta: emptyMeta };
};

export interface PaymentStats {
  total_revenue: number;
  monthly_revenue: number;
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  pending_transactions: number;
  active_subscribers: number;
  this_month_donations: number;
}

export function usePayments(page: number = 1, page_size: number = 20) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    count: 0,
    total_pages: 1,
    current_page: 1,
    next: null,
    previous: null,
  });
  const [filters, setFilters] = useState<PaymentsQuery>({});
  const axios = useAxios();

  const loadPayments = useCallback(
    async (overrides: Partial<PaymentsQuery & { page?: number }> = {}) => {
      const params = {
        page,
        page_size,
        ...filters,
        ...overrides,
      };

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("/payment/list/", {
          params,
        });

        const { items, meta } = extractPayments(
          response.data,
          Number(params.page ?? page)
        );

        setPayments(items);
        setPagination(meta);
      } catch (err: any) {
        let errorMessage = "Failed to fetch payments";
        
        if (err.response?.status === 403) {
          errorMessage = err.response?.data?.detail || 
                        err.response?.data?.message || 
                        "You need admin or staff privileges to view all payments. Please contact an administrator to get the required permissions.";
        } else {
          errorMessage = err.response?.data?.detail || 
                        err.response?.data?.message || 
                        err.message || 
                        "Failed to fetch payments";
        }
        
        setError(errorMessage);
        console.error("Error fetching payments:", err);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    },
    [axios, filters, page, page_size]
  );

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const updateFilters = useCallback((updates: PaymentsQuery) => {
    setFilters((prev) => {
      const next = { ...prev, ...updates };

      Object.keys(next).forEach((key) => {
        const typedKey = key as keyof PaymentsQuery;
        const value = next[typedKey];
        if (value === undefined || value === null || value === "" || value === "all") {
          delete next[typedKey];
        }
      });

      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(next);

      const isSameLength = prevKeys.length === nextKeys.length;
      const hasSameEntries = isSameLength
        ? nextKeys.every((key) => prev[key as keyof PaymentsQuery] === next[key as keyof PaymentsQuery])
        : false;

      if (isSameLength && hasSameEntries) {
        return prev;
      }

      return next;
    });
  }, []);

  const resetFilters = useCallback(() => setFilters({}), []);

  const getPaymentById = async (paymentId: number): Promise<Payment | null> => {
    try {
      const response = await axios.get(`/payment/detail/${paymentId}/`);
      return normalizePayment(response.data);
    } catch (err: any) {
      console.error("Error fetching payment by ID:", err);
      throw new Error(err.response?.data?.message || "Failed to fetch payment details");
    }
  };

  const refetch = useCallback(() => {
    loadPayments();
  }, [loadPayments]);

  return {
    payments,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    resetFilters,
    getPaymentById,
    refetch,
    loadPayments,
  };
}

const defaultStats: PaymentStats = {
  total_revenue: 0,
  monthly_revenue: 0,
  total_transactions: 0,
  successful_transactions: 0,
  failed_transactions: 0,
  pending_transactions: 0,
  active_subscribers: 0,
  this_month_donations: 0,
};

const normalizeStats = (raw: any): PaymentStats => ({
  total_revenue: Number(raw?.total_revenue ?? raw?.totalRevenue ?? 0),
  monthly_revenue: Number(raw?.monthly_revenue ?? raw?.monthlyRevenue ?? 0),
  total_transactions: Number(raw?.total_transactions ?? raw?.totalTransactions ?? 0),
  successful_transactions: Number(
    raw?.successful_transactions ?? raw?.successfulTransactions ?? 0
  ),
  failed_transactions: Number(raw?.failed_transactions ?? raw?.failedTransactions ?? 0),
  pending_transactions: Number(
    raw?.pending_transactions ?? raw?.pendingTransactions ?? 0
  ),
  active_subscribers: Number(raw?.active_subscribers ?? raw?.activeSubscribers ?? 0),
  this_month_donations: Number(
    raw?.this_month_donations ?? raw?.thisMonthDonations ?? 0
  ),
});

export function usePaymentStats() {
  const [stats, setStats] = useState<PaymentStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/payment/stats/");
      console.log(response)
      setStats(normalizeStats(response.data));
    } catch (err: any) {
      console.error("Error fetching payment stats:", err);
      
      let errorMessage = "Failed to fetch payment stats";
      if (err.response?.status === 403) {
        errorMessage = err.response?.data?.detail || 
                      err.response?.data?.message || 
                      "You need admin or staff privileges to view payment statistics.";
      } else {
        errorMessage = err.response?.data?.detail || 
                      err.response?.data?.message || 
                      err.message || 
                      "Failed to fetch payment stats";
      }
      
      setError(errorMessage);
      setStats(defaultStats);
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useUserPayments(limit: number = 5) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();

  const fetchUserPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get("/payment/user-payments/", {
        params: { page_size: limit }
      });

      const { items } = extractPayments(response.data, 1);
      setPayments(items);
    } catch (err: any) {
      let errorMessage = "Failed to fetch your payments";
      
      if (err.response?.status === 403) {
        errorMessage = "Please login to view your payments";
      } else {
        errorMessage = err.response?.data?.detail || 
                      err.response?.data?.message || 
                      err.message || 
                      "Failed to fetch your payments";
      }
      
      setError(errorMessage);
      console.error("Error fetching user payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [axios, limit]);

  useEffect(() => {
    fetchUserPayments();
  }, [fetchUserPayments]);

  return {
    payments,
    loading,
    error,
    refetch: fetchUserPayments
  };
}
