"use client";

import { useState, useCallback } from "react";
import useAxios from "@/hooks/use-axios";
import { useAuth } from "@/hooks/use-auth";
import type { DonationFormData, ManualPaymentFormData } from "../types";

function convertNumberToWords(num: number): string {
  if (num === 0) return "Zero Rupees Only";
  
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  
  function convertLessThanThousand(n: number): string {
    if (n === 0) return "";
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "");
  }
  
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = Math.floor(num % 1000);
  
  let result = "";
  
  if (crore > 0) result += convertLessThanThousand(crore) + " Crore ";
  if (lakh > 0) result += convertLessThanThousand(lakh) + " Lakh ";
  if (thousand > 0) result += convertLessThanThousand(thousand) + " Thousand ";
  if (remainder > 0) result += convertLessThanThousand(remainder);
  
  return result.trim() + " Rupees Only";
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: PaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, unknown>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
    animation?: boolean;
    confirm_close?: boolean;
  };
  readonly?: {
    contact?: boolean;
    email?: boolean;
    name?: boolean;
  };
  hidden?: {
    contact?: boolean;
    email?: boolean;
  };
  send_sms_hash?: boolean;
  allow_rotation?: boolean;
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  timeout?: number;
  remember_customer?: boolean;
}

interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface OrderCreateResponse {
  success: boolean;
  order_id?: string;
  amount?: number;
  currency?: string;
  razorpay_key?: string;
  error?: string;
  message?: string;
}

interface PaymentVerificationResponse {
  success: boolean;
  payment_verified?: boolean;
  donation_id?: string;
  receipt_url?: string;
  message?: string;
  error?: string;
  payment_id?: string;
  order_id?: string;
  status?: string;
}

export type PaymentStep =
  | "idle"
  | "creating-order"
  | "waiting-payment"
  | "verifying"
  | "completed";

export function useDonationPayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [donationId, setDonationId] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<PaymentStep>("idle");
  const [orderData, setOrderData] = useState<OrderCreateResponse | null>(null);

  const axios = useAxios();
  const { user } = useAuth();

  const createOrder = useCallback(
    async (formData: DonationFormData): Promise<OrderCreateResponse> => {
      try {
        if (!axios) {
          throw new Error("Axios instance not available. Please login and try again.");
        }

        const response = await axios.post("/payment/init/", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount: formData.amount,
          payment_for: formData.payment_for,
          notes: formData.notes || "",
          currency: "INR",
        });

        const responseMessage = response.data?.message?.toLowerCase() || "";
        const responseError = response.data?.error?.toLowerCase() || "";

        if (
          responseMessage.includes("already a member") ||
          responseMessage.includes("user already a member") ||
          responseError.includes("already a member") ||
          responseError.includes("user already a member")
        ) {
          return {
            success: false,
            error:
              response.data.message ||
              response.data.error ||
              "User already a member",
          };
        }

        if (!response.data.order_id) {
          return {
            success: false,
            error:
              response.data.message ||
              response.data.error ||
              "No order ID received from server",
          };
        }

        return {
          success: true,
          order_id: response.data.order_id,
          amount: response.data.amount,
          currency: "INR",
          razorpay_key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          message: "Order created successfully",
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error("Order creation error:", error);
        }
        const errorResponse = error as {
          response?: { status?: number; data?: { error?: string; message?: string } };
          config?: { url?: string; method?: string };
          code?: string;
          message?: string;
        };

        const errorDetails = {
          message: errorResponse?.message || "Unknown error",
          response: errorResponse?.response?.data || null,
          status: errorResponse?.response?.status || null,
          config: {
            url: errorResponse?.config?.url || "Unknown URL",
            method: errorResponse?.config?.method || "Unknown method",
          },
        };
        console.error("Order creation error details:", errorDetails);

        let errorMessage = "Failed to create order";

        if (errorResponse?.response?.data?.error) {
          errorMessage = errorResponse.response.data.error;
        } else if (errorResponse?.response?.data?.message) {
          errorMessage = errorResponse.response.data.message;
        } else if (errorResponse?.message) {
          errorMessage = errorResponse.message;
        } else if (errorResponse?.response?.status === 401) {
          errorMessage = "Please login to continue with payment";
        } else if (errorResponse?.response?.status === 500) {
          errorMessage = "Server error. Please try again later";
        } else if (errorResponse?.code === "ERR_NETWORK") {
          errorMessage =
            "Network error. Please check your internet connection";
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [axios]
  );

  const verifyPayment = useCallback(
    async (
      razorpayPaymentId: string,
      razorpayOrderId: string,
      razorpaySignature: string
    ): Promise<PaymentVerificationResponse> => {
      try {
        if (!axios) {
          throw new Error("Axios instance not available");
        }

        const response = await axios.post("/payment/verify/", {
          order_id: razorpayOrderId,
          payment_id: razorpayPaymentId,
          signature: razorpaySignature,
        });

        return {
          success: true,
          payment_verified: true,
          message: response.data.message || "Payment verified successfully",
          payment_id: response.data.payment_id,
          order_id: response.data.order_id,
          status: response.data.status,
        };
      } catch (err) {
        if (err instanceof Error) {
          console.error("Payment verification error:", err);
        }
        const errorResponse = err as {
          response?: { data?: { error?: string; message?: string } };
          message?: string;
        };
        console.error("Payment verification error details:", {
          message: errorResponse?.message || "Unknown error",
          response: errorResponse?.response?.data || null,
        });
        
        let errorMessage = "Payment verification failed";
        
        if (errorResponse?.response?.data?.error) {
          errorMessage = errorResponse.response.data.error;
        } else if (errorResponse?.response?.data?.message) {
          errorMessage = errorResponse.response.data.message;
        } else if (errorResponse?.message) {
          errorMessage = errorResponse.message;
        }
        
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [axios]
  );

  const processPayment = useCallback(
    async (formData: DonationFormData) => {
      try {
        setIsProcessing(true);
        setError(null);
        setSuccess(false);
        setCurrentStep("creating-order");

        const orderResponse = await createOrder(formData);

        // Handle "already a member" error gracefully
        if(orderResponse.error?.includes("already a member")) {
          setError(orderResponse.error);
          setIsProcessing(false);
          setCurrentStep("idle");
          return;
        }

        // Handle any other errors from order creation
        if (!orderResponse.success) {
          const errorMsg = orderResponse.error || "Failed to create payment order. Please try again.";
          setError(errorMsg);
          setIsProcessing(false);
          setCurrentStep("idle");
          return;
        }

        if (!orderResponse.order_id) {
          setError("No order ID received from server. Please try again.");
          setIsProcessing(false);
          setCurrentStep("idle");
          return;
        }

        setOrderData(orderResponse);
        setCurrentStep("waiting-payment");
        setIsProcessing(false);

        const options: RazorpayOptions = {
          key:
            orderResponse.razorpay_key ||
            process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
            "",
          amount: orderResponse.amount || 0,
          currency: orderResponse.currency || "INR",
          name: "राष्ट्रीय सेवा संघ",
          description: `दान - ${formData.payment_for}`,
          image: `${window.location.origin}/logo/logo.png`,
          order_id: orderResponse.order_id, 
          handler: async (response: PaymentResponse) => {
            try {
              setCurrentStep("verifying");

              const verificationResponse = await verifyPayment(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature
              );

              if (
                verificationResponse.success &&
                verificationResponse.payment_verified
              ) {
                setSuccess(true);
                setDonationId(verificationResponse.donation_id || null);
                setReceiptUrl(verificationResponse.receipt_url || null);
                setCurrentStep("completed");

                const userCountry = user?.country || "N/A";
                const userState = user?.state || "N/A";
                const userCity = user?.city || "N/A";
                const userPostalCode = user?.postal_code || "N/A";

                setTimeout(() => {
                  const receiptParams = new URLSearchParams({
                    name: formData.name || "",
                    phone: formData.phone || "",
                    date: new Date().toLocaleDateString("en-IN"),
                    mode: "Online payment",
                    amount: String(formData.amount / 100),
                    amountWords: convertNumberToWords(formData.amount / 100),
                    receiptNumber:
                      verificationResponse.payment_id ||
                      verificationResponse.order_id ||
                      "N/A",
                    country: userCountry,
                    state: userState,
                    city: userCity,
                    postal_code: userPostalCode,
                  });

                  const receiptUrlString = `/receipt?${receiptParams.toString()}`;

                  const link = document.createElement("a");
                  link.href = receiptUrlString;
                  link.target = "_blank";
                  link.rel = "noopener noreferrer";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }, 100);
              } else {
                throw new Error(
                  verificationResponse.error || "Payment verification failed"
                );
              }
            } catch (verifyError) {
              if (verifyError instanceof Error) {
                console.error(
                  "Step 3 Failed: Payment verification error",
                  verifyError
                );
              }
              const errorMsg =
                verifyError instanceof Error
                  ? verifyError.message
                  : "Payment verification failed";
              setError(errorMsg);
              setCurrentStep("idle");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            payment_for: formData.payment_for,
            notes: formData.notes || "",
            donor_name: formData.name,
            donor_email: formData.email,
            donor_phone: formData.phone,
          },
          theme: {
            color: "#FF9933",
            backdrop_color: "rgba(0, 0, 0, 0.6)",
          },
          modal: {
            ondismiss: () => {
              console.log("Payment cancelled by user");
              setIsProcessing(false);
              setError("भुगतान रद्द कर दिया गया");
              setCurrentStep("idle");
            },
            escape: true,
            backdropclose: false,
            animation: true,
            confirm_close: true,
          },
          readonly: {
            contact: true,
            email: true,
            name: true,
          },
          send_sms_hash: true,
          allow_rotation: true,
          retry: {
            enabled: true,
            max_count: 4,
          },
          timeout: 900,
          remember_customer: false,
        };

        if (typeof window.Razorpay === "undefined") {
          await loadRazorpayScript();
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        if (error instanceof Error) {
          console.error("Payment processing error:", error);
        }
        const errorMsg =
          error instanceof Error
            ? error.message
            : "An error occurred during payment processing";
        setError(errorMsg);
        setIsProcessing(false);
        setCurrentStep("idle");
      }
    },
    [createOrder, verifyPayment, user?.country, user?.state, user?.city, user?.postal_code]
  );

  const mannualPayment = useCallback(
    async (formData: ManualPaymentFormData) => {
      try {
        setIsProcessing(true);
        setError(null);
        setSuccess(false);
        setCurrentStep("creating-order");

        const timestamp = Date.now();
        const orderIdManual = `manual_order_${timestamp}`;
        const paymentIdManual = `manual_payment_${timestamp}`;

        const response = await axios.post("/payment/create/", {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          amount: formData.amount,
          payment_for: formData.payment_for,
          notes: formData.notes || "",
          method: formData.method,
          payment_details: formData.payment_details || {},
          status: "COMPLETED",
          order_id: orderIdManual,
          payment_id: paymentIdManual,
        });

        if (response.data && response.data.id) {
          setSuccess(true);
          setDonationId(
            response.data.payment_id || response.data.order_id || null
          );
          setCurrentStep("completed");
        } else {
          throw new Error("Invalid response from server");
        }
        
      } catch (err) {
        if (err instanceof Error) {
          console.error("Manual payment error:", err);
        }
        const errorResponse = err as {
          response?: { status?: number; data?: { error?: string; message?: string } };
          message?: string;
        };

        let errorMessage = "Manual payment entry failed";

        if (errorResponse?.response?.status === 403) {
          errorMessage =
            "You need admin or staff privileges to create manual payments. Please contact an administrator to get the required permissions.";
        } else {
          errorMessage =
            errorResponse?.response?.data?.error ||
            errorResponse?.response?.data?.message ||
            errorResponse?.message ||
            "Manual payment entry failed";
        }

        setError(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    },
    [axios]
  );

  const reset = useCallback(() => {
    setIsProcessing(false);
    setError(null);
    setSuccess(false);
    setDonationId(null);
    setReceiptUrl(null);
    setCurrentStep("idle");
    setOrderData(null);
  }, []);

  return {
    processPayment,
    mannualPayment,
    isProcessing,
    error,
    success,
    donationId,
    receiptUrl,
    currentStep,
    orderData,
    reset,
  };
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useCurrency() {
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  return { formatCurrency };
}
