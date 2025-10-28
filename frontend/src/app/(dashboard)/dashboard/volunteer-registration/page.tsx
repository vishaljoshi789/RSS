"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import useAuth from "@/hooks/use-auth";
import { createVolunteerAPI } from "@/module/dashboard/volunteer";
import ApplicationForm from "./_components/application";
import AddressForm from "./_components/address";
import PaymentForm from "./_components/payment";
import { useDonationPayment } from "@/module/donation";
import {
  saveToLocalStorage,
  getFromLocalStorage,
  clearFromLocalStorage,
} from "@/lib/localstoragehelper";

export interface ApplicationFormData {
  user?: number;
  wing: number | null;
  level: number | null;
  level_name?: string | null;
  designation: number | null;
  phone_number: string | null;
  affidavit?: File | null;
  aadhar_card_front?: File | null;
  aadhar_card_back?: File | null;
  image?: File | null;
}

export interface AddressFormData {
  street?: string;
  sub_district?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  mandal?: string;
}

const CareersPage = () => {
  const axios = useAxios();
  const { user } = useAuth();
  const api = createVolunteerAPI(axios);

  const [step, setStep] = useState(1);

  const [applicationData, setApplicationData] = useState<ApplicationFormData>(
    getFromLocalStorage("applicationData", {
      user: user?.id || undefined,
      wing: null,
      level: null,
      level_name: null,
      designation: null,
      phone_number: null,
      affidavit: null,
      aadhar_card_front: null,
      aadhar_card_back: null,
      image: null,
    })
  );

  const [addressData, setAddressData] = useState<AddressFormData>(
    getFromLocalStorage("addressData", {
      street: "",
      sub_district: "",
      district: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      mandal: "",
    })
  );

  const [loading, setLoading] = useState(false);

  const { processPayment, isProcessing, success, error } = useDonationPayment();

  const LEVEL_AMOUNT_MAP: Record<string, number> = {
    
    National: 5100,
    State: 1100,
    Division: 751,
    District: 501,
    "City/Village": 251,
    "राष्ट्रीय": 5100,
    "प्रदेश": 1100,
    "संभाग": 751,
    "मंडल": 751,
    "संभाग/ मंडल": 751,
    "जिला": 501,
    "नगर": 251,
    "ग्राम": 251,
    "नगर/ग्राम": 251,
  };

  const getAmountForLevel = (levelName?: string | null) => {
    if (!levelName) return undefined;
    
    if (LEVEL_AMOUNT_MAP[levelName]) return LEVEL_AMOUNT_MAP[levelName];
    
    const lowered = levelName.toLowerCase();
    if (lowered.includes("राष्ट्रीय") || lowered.includes("national")) return 5100;
    if (lowered.includes("प्रदेश") || lowered.includes("state")) return 1100;
    if (lowered.includes("संभाग") || lowered.includes("मंडल") || lowered.includes("division")) return 751;
    if (lowered.includes("जिला") || lowered.includes("district")) return 501;
    if (lowered.includes("नगर") || lowered.includes("ग्राम") || lowered.includes("city") || lowered.includes("village")) return 251;
    return undefined;
  };

  useEffect(() => {
    saveToLocalStorage("applicationData", applicationData);
  }, [applicationData]);

  useEffect(() => {
    if (user?.id && !applicationData.user) {
      setApplicationData((prev) => ({ ...prev, user: user.id }));
    }
  }, [user, applicationData.user]);

  useEffect(() => {
    saveToLocalStorage("addressData", addressData);
  }, [addressData]);

  const handlePaymentConfirm = async () => {
    try {
      toast.loading("Opening payment gateway...", { id: "payment-processing" });

      const amount = getAmountForLevel(applicationData.level_name) || 0;

      await processPayment({
        name: user?.name || "",
        email: user?.email || "",
        phone: applicationData.phone_number || "",
        amount: amount * 100,
        payment_for: "volunteer",
        notes: `Membership registration for ${user?.name || ""}`,
      });

      setTimeout(() => {
        toast.dismiss("payment-processing");
      }, 1000);
    } catch (error: any) {
      console.error("Registration or payment failed:", error);

      toast.dismiss("member-registration");
      toast.dismiss("payment-processing");

      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again later.";
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const updateAddress = async (data: AddressFormData) => {
    try {
      const response = await axios.put(`/account/detail/${user?.id}/`, data);
      if (response) toast.success("Address updated successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);

      const applicationPayload = { ...applicationData, user: user?.id };

      const response = await Promise.all([
        api.createApplication(applicationPayload),
        updateAddress(addressData),
        handlePaymentConfirm(),
      ]);

      if(response){
        toast.success("Application submitted successfully!");

      toast.success("Application submitted successfully!", {
        id: "final-submit",
      });

      clearFromLocalStorage("applicationData");
      clearFromLocalStorage("addressData");

      setApplicationData({
        user: user?.id || undefined,
        wing: null,
        level: null,
        level_name: null,
        designation: null,
        phone_number: null,
        affidavit: null,
        aadhar_card_front: null,
        aadhar_card_back: null,
        image: null,
      });

      setAddressData({
        street: "",
        sub_district: "",
        district: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        mandal: "",
      });

      setStep(1);

      setTimeout(() => toast.dismiss(), 1000);

      setStep(1);
      }else {
        toast.error("Failed to complete submission. Try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to complete submission. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Step 1: Application Details"}
            {step === 2 && "Step 2: Address Information"}
            {step === 3 && "Step 3: Payment & Submit"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <ApplicationForm
              data={applicationData}
              setData={setApplicationData}
              onNext={handleNext}
            />
          )}
          {step === 2 && (
            <AddressForm
              data={addressData}
              setData={setAddressData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 3 && (
            <PaymentForm
              onBack={handleBack}
              onSubmit={handleFinalSubmit}
              loading={loading}
              amount={getAmountForLevel(applicationData.level_name)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CareersPage;
