import { useState, useCallback } from "react";
import useAxios from "@/hooks/use-axios";

type MemberFormData = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  profession: string;
  image: File | null;
  sub_district: string;
  district: string;
  city: string;
  state: string;
  postal_code: string;
  referred_by?: string;
};

export const useMemberSubmit = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitMemberForm = useCallback(
    async (formData: MemberFormData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const payload = new FormData();

        // Required fields
        payload.append("name", formData.name);
        payload.append("email", formData.email);
        payload.append("phone", formData.phone);
        payload.append("dob", formData.dob);
        // payload.append("is_member_account", "true");

        // Optional fields - only append if they have values
        if (formData.gender) {
          payload.append("gender", formData.gender);
        }
        if (formData.profession) {
          payload.append("profession", formData.profession);
        }
        if (formData.image) {
          payload.append("image", formData.image);
        }
        if (formData.sub_district) {
          payload.append("sub_district", formData.sub_district);
        }
        if (formData.district) {
          payload.append("district", formData.district);
        }
        if (formData.city) {
          payload.append("city", formData.city);
        }
        if (formData.state) {
          payload.append("state", formData.state);
        }
        if (formData.postal_code) {
          payload.append("postal_code", formData.postal_code);
        }
        if (formData.referred_by) {
          payload.append("referred_by", formData.referred_by);
        }

        const response = await axios.post("/account/member/", payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const responseMessage = response.data?.message?.toLowerCase() || "";
        const responseError = response.data?.error?.toLowerCase() || "";
        
        if (
          responseMessage.includes("already a member") ||
          responseMessage.includes("user already a member") ||
          responseError.includes("already a member") ||
          responseError.includes("user already a member")
        ) {
          // Create an error object that mimics axios error structure
          const error: any = new Error(response.data.message || response.data.error);
          error.response = {
            data: response.data
          };
          setError(response.data.message || response.data.error);
          setLoading(false);
          throw error;
        }

        setSuccess(true);
        setLoading(false);
        return response.data;
      } catch (err: any) {
        // Only process error if it's not already processed above
        if (!err.response) {
          const errorMessage = "Failed to submit membership form. Please try again.";
          setError(errorMessage);
          setLoading(false);
          throw err;
        }
        
        const errorMessage =
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to submit membership form. Please try again.";
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return {
    submitMemberForm,
    loading,
    error,
    success,
    reset,
  };
};
