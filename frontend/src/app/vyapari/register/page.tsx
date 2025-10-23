"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { useAuth } from "@/context/AuthContext";
import type { Category, SubCategory } from "../types";
import {
  PageHeader,
  ProgressSteps,
  BasicInfoStep,
  ContactAddressStep,
  ImageUploadStep,
  FormNavigation,
  LoginRequiredModal,
} from "./_components";

interface FormData {
  // Basic Information
  name: string;
  category: string;
  subcategory: string;
  owner: string;
  short_description: string;
  long_description: string;

  // Contact Information
  phone: string;
  email: string;
  website_url: string;
  insta_url: string;
  facebook_url: string;
  referred_by: string;

  // Address
  address_line1: string;
  address_line2: string;
  street: string;
  landmark: string;
  market: string;
  district: string;
  state: string;
  postal_code: string;
  country: string;

  // Location
  latitude: string;
  longitude: string;
}

export default function RegisterBusinessPage() {
  const router = useRouter();
  const axios = useAxios();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategory[]
  >([]);

  // Image files and previews
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  
  const [emailVerified, setEmailVerified] = useState(false);
  
  const [referralVerified, setReferralVerified] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "none",
    subcategory: "none",
    owner: "",
    short_description: "",
    long_description: "",
    phone: "",
    email: "",
    website_url: "",
    insta_url: "",
    facebook_url: "",
    referred_by: "",
    address_line1: "",
    address_line2: "",
    street: "",
    landmark: "",
    market: "",
    district: "",
    state: "",
    postal_code: "",
    country: "India",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (formData.category && formData.category !== "none") {
      const filtered = subcategories.filter(
        (sub) => sub.category.toString() === formData.category
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.category, subcategories]);

  const fetchData = async () => {
    try {
      const [categoriesRes, subcategoriesRes] = await Promise.all([
        axios.get("/vyapari/category/"),
        axios.get("/vyapari/subcategory/"),
      ]);

      setCategories(categoriesRes.data.results || categoriesRes.data || []);
      setSubcategories(
        subcategoriesRes.data.results || subcategoriesRes.data || []
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load categories");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "cover_image"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "logo") {
        setLogoFile(file);
        setLogoPreview(reader.result as string);
      } else {
        setCoverImageFile(file);
        setCoverImagePreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: "logo" | "cover_image") => {
    if (type === "logo") {
      setLogoFile(null);
      setLogoPreview("");
    } else {
      setCoverImageFile(null);
      setCoverImagePreview("");
    }
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          toast.error("Business name is required");
          return false;
        }
        if (!formData.phone.trim()) {
          toast.error("Phone number is required");
          return false;
        }
        if (formData.category === "none") {
          toast.error("Please select a category");
          return false;
        }
        break;
      case 2:
        if (
          !formData.address_line1.trim() ||
          !formData.market.trim() ||
          !formData.state.trim()
        ) {
          toast.error("Address, market, and state are required");
          return false;
        }
        if (!formData.email.trim()) {
          toast.error("Email address is required");
          return false;
        }
        if (!emailVerified) {
          toast.info("Please verify your email by clicking the 'Check' button");
          return false;
        }
        if (!formData.referred_by.trim()) {
          toast.error("Referral ID is required");
          return false;
        }
        if (!referralVerified) {
          toast.info("Please verify the referral ID by clicking the 'Check Referral' button");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleLoginRedirect = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("redirectAfterLogin", "/vyapari/register");
    }
    router.push("/auth/login");
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    try {
      setLoading(true);

      const submitFormData = new FormData();

      submitFormData.append("name", formData.name);
      submitFormData.append("phone", formData.phone);

      if (formData.category !== "none") {
        submitFormData.append("category", formData.category);
      }
      if (formData.subcategory !== "none") {
        submitFormData.append("subcategory", formData.subcategory);
      }
      if (formData.owner) submitFormData.append("owner", formData.owner);
      if (formData.short_description)
        submitFormData.append("short_description", formData.short_description);
      if (formData.long_description)
        submitFormData.append("long_description", formData.long_description);
      if (formData.email) submitFormData.append("email", formData.email);
      if (formData.website_url)
        submitFormData.append("website_url", formData.website_url);
      if (formData.insta_url)
        submitFormData.append("insta_url", formData.insta_url);
      if (formData.facebook_url)
        submitFormData.append("facebook_url", formData.facebook_url);
      if (formData.referred_by)
        submitFormData.append("referred_by", formData.referred_by);

      const address = {
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        street: formData.street,
        landmark: formData.landmark,
        market: formData.market,
        district: formData.district,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
      };
      submitFormData.append("address", JSON.stringify(address));

      const location: any = {};
      if (formData.latitude) location.latitude = parseFloat(formData.latitude);
      if (formData.longitude)
        location.longitude = parseFloat(formData.longitude);
      submitFormData.append("location", JSON.stringify(location));

      if (logoFile) {
        submitFormData.append("logo", logoFile);
      }
      if (coverImageFile) {
        submitFormData.append("cover_image", coverImageFile);
      }

      await axios.post("/vyapari/vyapari/", submitFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        "Business registered successfully! Pending admin approval."
      );

      setTimeout(() => {
        router.push("/vyapari");
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginRequiredModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onConfirm={handleLoginRedirect}
      />

      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <PageHeader onBackClick={() => router.push("/vyapari")} />

          <div className="flex gap-6 mt-8">
            {/* Left side - Form */}
            <div className="flex-1 max-w-4xl">
              <ProgressSteps currentStep={step} />

              <Card className="border-2 mt-8">
                <CardContent className="p-6">
                  {step === 1 && (
                    <BasicInfoStep
                      formData={formData}
                      categories={categories}
                      filteredSubcategories={filteredSubcategories}
                      handleInputChange={handleInputChange}
                      handleSelectChange={handleSelectChange}
                    />
                  )}

                  {step === 2 && (
                    <ContactAddressStep
                      formData={formData}
                      handleInputChange={handleInputChange}
                      emailVerified={emailVerified}
                      setEmailVerified={setEmailVerified}
                      referralVerified={referralVerified}
                      setReferralVerified={setReferralVerified}
                    />
                  )}

                  {step === 3 && (
                    <ImageUploadStep
                      logoFile={logoFile}
                      coverImageFile={coverImageFile}
                      logoPreview={logoPreview}
                      coverImagePreview={coverImagePreview}
                      handleFileChange={handleFileChange}
                      removeImage={removeImage}
                    />
                  )}

                  <FormNavigation
                    step={step}
                    loading={loading}
                    onBack={handleBack}
                    onNext={handleNext}
                    onSubmit={handleSubmit}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:flex w-full max-w-sm items-start justify-center">
              <div className="sticky top-24 w-full h-[600px] rounded-xl overflow-hidden border-2 border-muted">
                <Image
                  src="/hero/business.jpg"
                  alt="Business Registration"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}