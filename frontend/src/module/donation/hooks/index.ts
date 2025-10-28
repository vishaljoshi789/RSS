"use client";

import { useState, useCallback, use } from "react";
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
    Razorpay: any;
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
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
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
      } catch (error: any) {
        console.error("Order creation error:", error);
        return {
          success: false,
          error:
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Failed to create order",
        };
      }
    },
    []
  );

  const verifyPayment = useCallback(
    async (
      razorpayPaymentId: string,
      razorpayOrderId: string,
      razorpaySignature: string
    ): Promise<PaymentVerificationResponse> => {
      try {
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
      } catch (error: any) {
        console.error("Payment verification error:", error);
        return {
          success: false,
          error:
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Payment verification failed",
        };
      }
    },
    []
  );

  const processPayment = useCallback(
    async (formData: DonationFormData) => {
      try {
        setIsProcessing(true);
        setError(null);
        setSuccess(false);
        setCurrentStep("creating-order");

        const orderResponse = await createOrder(formData);

        if(orderResponse.error?.includes("already a member")) {
          setError(orderResponse.error);
          setIsProcessing(false);
          setCurrentStep("idle");
          return;
        }

        if (!orderResponse.success) {
          throw new Error(
            orderResponse.error || "Failed to create payment order"
          );
        }

        if (!orderResponse.order_id) {
          throw new Error("No order ID received from server");
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
          name: "RSS - Rashtriya Swayamsevak Sangh",
          description: `Donation - ${formData.payment_for}`,
          image: "/logo/logo.png",
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

                
                setTimeout(() => {
                  const receiptParams = new URLSearchParams({
                    name: formData.name || '',
                    phone: formData.phone || '',
                    date: new Date().toLocaleDateString('en-IN'),
                    mode: 'Online payment',
                    amount: String(formData.amount / 100),
                    amountWords: convertNumberToWords(formData.amount / 100),
                    receiptNumber: verificationResponse.payment_id || verificationResponse.order_id || 'N/A',
                    country: user?.country || 'N/A',
                    state: user?.state || 'N/A',
                    city: user?.city || 'N/A',
                    postal_code: user?.postal_code || 'N/A',
                  });

                  const receiptUrl = `/receipt?${receiptParams.toString()}`;
                  
                  
                  const link = document.createElement('a');
                  link.href = receiptUrl;
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }, 100);
              } else {
                throw new Error(
                  verificationResponse.error || "Payment verification failed"
                );
              }
            } catch (verifyError: any) {
              console.error(
                "Step 3 Failed: Payment verification error",
                verifyError
              );
              setError(verifyError.message || "Payment verification failed");
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
          },
          theme: {
            color: "#FF9933",
          },
          modal: {
            ondismiss: () => {
              console.log("Payment cancelled by user");
              setIsProcessing(false);
              setError("Payment cancelled by user");
              setCurrentStep("idle");
            },
          },
        };

        if (typeof window.Razorpay === "undefined") {
          await loadRazorpayScript();
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error: any) {
        setError(
          error.message || "An error occurred during payment processing"
        );
        setIsProcessing(false);
        setCurrentStep("idle");
      }
    },
    [createOrder, verifyPayment]
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
      } catch (error: any) {
        console.error("Manual payment error:", error);

        let errorMessage = "Manual payment entry failed";

        if (error.response?.status === 403) {
          errorMessage =
            "You need admin or staff privileges to create manual payments. Please contact an administrator to get the required permissions.";
        } else {
          errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "Manual payment entry failed";
        }

        setError(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    },
    [user]
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
