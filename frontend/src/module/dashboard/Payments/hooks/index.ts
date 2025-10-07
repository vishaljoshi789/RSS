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
  const axios = useAxios();

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/admin/payments/", {
        params: { page, page_size }
      });
      
      const paymentData = response.data;
      if (Array.isArray(paymentData)) {
        setPayments(paymentData);
        setPagination({
          count: paymentData.length,
          total_pages: 1,
          current_page: 1,
          next: null,
          previous: null,
        });
      } else if (paymentData && Array.isArray(paymentData.results)) {
        setPayments(paymentData.results);
        setPagination({
          count: paymentData.count || paymentData.results.length,
          total_pages: paymentData.total_pages || 1,
          current_page: paymentData.current_page || page,
          next: paymentData.next || null,
          previous: paymentData.previous || null,
        });
      } else if (paymentData && Array.isArray(paymentData.data)) {
        setPayments(paymentData.data);
        setPagination({
          count: paymentData.count || paymentData.data.length,
          total_pages: paymentData.total_pages || 1,
          current_page: paymentData.current_page || page,
          next: paymentData.next || null,
          previous: paymentData.previous || null,
        });
      } else {
        console.warn("Unexpected API response format:", paymentData);
        setPayments([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to fetch payments";
      setError(errorMessage);
      console.error("Error fetching payments:", err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [axios, page, page_size]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const searchPayments = async (searchTerm: string) => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/payments/", {
        params: { search: searchTerm, page, page_size }
      });
      
      const paymentData = response.data;
      if (Array.isArray(paymentData)) {
        setPayments(paymentData);
      } else if (paymentData && Array.isArray(paymentData.results)) {
        setPayments(paymentData.results);
        setPagination({
          count: paymentData.count || paymentData.results.length,
          total_pages: paymentData.total_pages || 1,
          current_page: paymentData.current_page || page,
          next: paymentData.next || null,
          previous: paymentData.previous || null,
        });
      } else if (paymentData && Array.isArray(paymentData.data)) {
        setPayments(paymentData.data);
      }
    } catch (err: any) {
      console.error("Error searching payments:", err);
      setError(err.response?.data?.message || "Failed to search payments");
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = async (filters: {
    status?: string;
    payment_for?: string;
    method?: string;
  }) => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/payments/", {
        params: { ...filters, page, page_size }
      });
      
      const paymentData = response.data;
      if (Array.isArray(paymentData)) {
        setPayments(paymentData);
      } else if (paymentData && Array.isArray(paymentData.results)) {
        setPayments(paymentData.results);
        setPagination({
          count: paymentData.count || paymentData.results.length,
          total_pages: paymentData.total_pages || 1,
          current_page: paymentData.current_page || page,
          next: paymentData.next || null,
          previous: paymentData.previous || null,
        });
      } else if (paymentData && Array.isArray(paymentData.data)) {
        setPayments(paymentData.data);
      }
    } catch (err: any) {
      console.error("Error filtering payments:", err);
      setError(err.response?.data?.message || "Failed to filter payments");
    } finally {
      setLoading(false);
    }
  };

  
  const getPaymentById = async (paymentId: number): Promise<Payment | null> => {
    try {
      const response = await axios.get(`/admin/payment/${paymentId}`);
      return response.data;
    } catch (err: any) {
      console.error("Error fetching payment by ID:", err);
      throw new Error(err.response?.data?.message || "Failed to fetch payment details");
    }
  };

  const refetch = () => {
    fetchPayments();
  };

  return {
    payments,
    loading,
    error,
    pagination,
    searchPayments,
    filterPayments,
    getPaymentById,
    refetch,
  };
}export function usePaymentStats() {
  const [stats, setStats] = useState<PaymentStats>({
    total_revenue: 0,
    monthly_revenue: 0,
    total_transactions: 0,
    successful_transactions: 0,
    failed_transactions: 0,
    pending_transactions: 0,
    active_subscribers: 0,
    this_month_donations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/payments/stats/");
      setStats(response.data);
    } catch (err: any) {
      console.error("Error fetching payment stats:", err);
      setError(err.response?.data?.message || "Failed to fetch payment stats");
    } finally {
      setLoading(false);
    }
  }, [axios]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
