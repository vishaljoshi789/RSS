"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import useAuth from "@/hooks/use-auth";
import { AddressFormData, ApplicationFormData, createVolunteerAPI } from "@/module/dashboard/volunteer";
import ApplicationForm from "./_components/application";
import AddressForm from "./_components/address";
import DeclarationForm from "./_components/declaration";
import PaymentForm from "./_components/payment";
import { useDonationPayment } from "@/module/donation";
import {
  saveToLocalStorage,
  getFromLocalStorage,
  clearFromLocalStorage,
} from "@/lib/localstoragehelper";

const CareersPage = () => {
  const axios = useAxios();
  const { user, refreshUserData } = useAuth();
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
      referred_by_volunteer: null,
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

  const { processPayment } = useDonationPayment();

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

  
  useEffect(() => {
    const savedData = sessionStorage.getItem("volunteer_registration_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const timestamp = parsed.timestamp || 0;
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        
        if (now - timestamp < thirtyMinutes) {
          if (parsed.applicationData) {
            setApplicationData(parsed.applicationData);
          }
          if (parsed.addressData) {
            setAddressData(parsed.addressData);
          }
          if (parsed.step) {
            setStep(parsed.step);
          }

          toast.success("Your form data has been restored. Please continue.", {
            duration: 5000,
          });

          
          sessionStorage.removeItem("volunteer_registration_data");
        } else {
          
          sessionStorage.removeItem("volunteer_registration_data");
          toast.info("Previous session data was too old and has been cleared.");
        }
      } catch (error) {
        if( error instanceof Error){
          console.error("Error restoring form data:", error);
          sessionStorage.removeItem("volunteer_registration_data");
        }
      }
    }
  }, []);

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
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration or payment failed:", error);
      }

      toast.dismiss("member-registration");
      toast.dismiss("payment-processing");
    }
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const updateAddress = async (data: AddressFormData) => {
    const response = await axios.put(`/account/detail/${user?.id}/`, data);
    return response;
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);

      // Step 1: Create Application
      toast.loading("Submitting application...", { id: "application-submit" });
      const applicationPayload = { ...applicationData, user: user?.id };
      
      let applicationResponse;
      try {
        applicationResponse = await api.createApplication(applicationPayload);
        
        
        if (!applicationResponse || !applicationResponse.id) {
          toast.dismiss("application-submit");
          toast.error("Failed to create application. Invalid response.");
          return;
        }
        
        toast.dismiss("application-submit");
        toast.success("Application created successfully!");
      } catch (appError) {
        toast.dismiss("application-submit");
        console.error("Application creation error:", appError);
        
        
        const errorResponse = appError as { response?: { status?: number; data?: { detail?: string; error?: string; message?: string } }; message?: string };
        const status = errorResponse?.response?.status;
        const errorMsg = errorResponse?.response?.data?.detail || 
                        errorResponse?.response?.data?.error || 
                        errorResponse?.response?.data?.message ||
                        errorResponse?.message;
        
        if (status === 401) {
          throw appError;
        } else if (status === 403) {
          toast.error(`Permission denied: ${errorMsg || 'You do not have permission to create applications.'}`);
        } else if (status && status >= 400 && status < 500) {
          toast.error(`Application error: ${errorMsg || 'Invalid data submitted.'}`);
        } else {
          toast.error(`Failed to create application: ${errorMsg || 'Please try again.'}`);
        }
        return; 
      }

      // Step 2: Update Address
      toast.loading("Updating address information...", { id: "address-update" });
      try {
        const addressResponse = await updateAddress(addressData);
        
        if (addressResponse?.status >= 200 && addressResponse?.status < 300) {
          toast.dismiss("address-update");
          toast.success("Address updated successfully!");
        } else {
          toast.dismiss("address-update");
          toast.error("Address update returned unexpected status. Cannot proceed.");
          return;
        }
      } catch (addressError) {
        toast.dismiss("address-update");
        console.error("Address update error:", addressError);
        
        const errorResponse = addressError as { response?: { status?: number; data?: { detail?: string; error?: string } }; message?: string };
        const status = errorResponse?.response?.status;
        const errorMsg = errorResponse?.response?.data?.detail || 
                        errorResponse?.response?.data?.error ||
                        errorResponse?.message;
        
        if (status === 401) {
          throw addressError; 
        } else if (status === 403) {
          toast.error(`Permission denied: ${errorMsg || 'You do not have permission to update address.'}`);
          return;
        } else if (status && status >= 400 && status < 500) {
          toast.error(`Address update failed: ${errorMsg || 'Invalid data submitted.'}`);
          return;
        } else {
          toast.error(`Failed to update address: ${errorMsg || 'Please try again.'}`);
          return;
        }
      }

      // Step 3: Process Payment (now step 4 since declaration was added)
      await handlePaymentConfirm();

      // Step 4: Success
      toast.success("Registration completed successfully!", {
        id: "final-submit",
        duration: 3000,
      });

      
      const refreshSuccess = await refreshUserData();
      if (!refreshSuccess) {
        console.warn("Could not refresh user data, but submission was successful");
      }
      
      clearFromLocalStorage("applicationData");
      clearFromLocalStorage("addressData");
      
      setApplicationData({
        user: user?.id || undefined,
        wing: null,
        level: null,
        level_name: null,
        designation: null,
        phone_number: null,
        referred_by_volunteer: null,
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
        hindi_name: "",
      });

      setStep(1);
      
    } catch (error) {
      console.error("Final submit error:", error);
      
      
      toast.dismiss("application-submit");
      toast.dismiss("address-update");
      toast.dismiss("payment-processing");
      
      
      const errorResponse = error as { response?: { status?: number }; status?: number; message?: string };
      const is401Error = 
        errorResponse?.response?.status === 401 || 
        errorResponse?.status === 401 ||
        errorResponse?.message?.includes("401") ||
        errorResponse?.message?.toLowerCase().includes("unauthorized");

      if (is401Error) {
        
        sessionStorage.setItem("volunteer_registration_data", JSON.stringify({
          applicationData,
          addressData,
          step,
          timestamp: Date.now()
        }));

        toast.error("Your session has expired. Please login again.", {
          duration: 5000,
        });

        setTimeout(() => {
          window.location.href = "/auth/login?redirect=/dashboard/volunteer-registration&reason=session_expired";
        }, 2000);
      } else {
        
        const errorData = errorResponse as { response?: { data?: { detail?: string; error?: string; message?: string } }; message?: string };
        const errorMessage = 
          errorData?.response?.data?.detail ||
          errorData?.response?.data?.error ||
          errorData?.response?.data?.message ||
          errorData?.message ||
          "Failed to complete submission. Please try again.";
        
        toast.error(errorMessage, { duration: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Volunteer Registration</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          {step === 1 && "Step 1: Application Details"}
          {step === 2 && "Step 2: Address Information"}
          {step === 3 && "Step 3: Declaration"}
          {step === 4 && "Step 4: Payment & Submit"}
        </p>
      </div>
      <Card>
        <CardContent className="p-4 sm:p-6">
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
            <DeclarationForm 
              addressData={addressData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 4 && (
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
