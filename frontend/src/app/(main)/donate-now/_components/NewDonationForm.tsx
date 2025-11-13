"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Heart,
  Phone,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Shield,
  Lock,
  Gift,
  Loader2,
  IndianRupee,
  Users,
  Wrench,
} from "lucide-react";
import {
  useDonationPayment,
  useCurrency,
  type DonationFormData,
} from "@/module/donation";
import { useCountryApi } from "@/module/country/hooks";
import { StateSelect, DistrictSelect } from "@/module/country/components/country-select";

const impactAmounts = [
  { amount: 151, label: "₹151", desc: "एक बच्चे का एक दिन का भोजन" },
  { amount: 501, label: "₹501", desc: "एक बहन की आपातकालीन सुरक्षा" },
  { amount: 1100, label: "₹1,100", desc: "एक यज्ञ, कथा या भंडारे में भागीदारी" },
  { amount: 5100, label: "₹5,100", desc: "एक कन्या विवाह सहयोग" },
  { amount: 11000, label: "₹11,000", desc: "एक गुरुकुल निर्माण में योगदान" },
  { amount: 21000, label: "₹21,000", desc: "वैदिक राष्ट्र बनाने में स्थायी सहयोग" },
];

const NewDonationForm = () => {
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [formData, setFormData] = useState<DonationFormData>({
    name: "",
    email: "",
    phone: "",
    amount: 0,
    payment_for: "general",
    notes: "",
    state: "",
    district: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    processPayment,
    isProcessing,
    error,
    success,
    currentStep,
    reset,
  } = useDonationPayment();
  const { formatCurrency } = useCurrency();
  const { states, fetchDistricts } = useCountryApi();

  
  const enhancedDonationTypes = [
    {
      value: "donation",
      label: "Donation",
      description: "Support overall RSS activities",
      icon: Users,
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      value: "general",
      label: "General",
      description: "General fund for various initiatives",
      icon: Shield,
      color: "bg-green-50 border-green-200 text-green-700",
    },
    // {
    //   value: "member",
    //   label: "Member",
    //   description: "Fund educational programs",
    //   icon: BookOpen,
    //   color: "bg-green-50 border-green-200 text-green-700",
    // },
    // {
    //   value: "volunteer",
    //   label: "Volunteer",
    //   description: "Support health initiatives",
    //   icon: Stethoscope,
    //   color: "bg-red-50 border-red-200 text-red-700",
    // },
    // {
    //   value: "vayapari",
    //   label: "Vayapari",
    //   description: "Building & development projects",
    //   icon: Building,
    //   color: "bg-purple-50 border-purple-200 text-purple-700",
    // },
    {
      value: "other",
      label: "Other",
      description: "Specify your purpose",
      icon: Wrench,
      color: "bg-gray-50 border-gray-200 text-gray-700",
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (
      !formData.phone ||
      !phoneRegex.test(formData.phone.replace(/[^0-9]/g, ""))
    ) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.amount || formData.amount < 1) {
      newErrors.amount = "Please select or enter a donation amount";
      toast.error("Please select a donation amount");
    } else if (formData.amount > 500000) {
      newErrors.amount = "Maximum donation amount is ₹5,00,000";
      toast.error("Maximum donation amount is ₹5,00,000");
    }

    if (!formData.payment_for) {
      newErrors.payment_for = "Please select what your donation is for";
      toast.error("Please select what your donation is for");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      if (!newErrors.amount && !newErrors.payment_for) {
        toast.error(firstError);
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const toastId = toast.loading("Initiating payment...");
      await processPayment({
        ...formData,
        amount: formData.amount * 100
      });
      toast.dismiss(toastId);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Payment submission error:", error);
      }
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const handleAmountSelect = (amount: number) => {
    if (amount === -1) {
      setIsCustomAmount(true);
      setSelectedAmount(null);
      setFormData((prev) => ({ ...prev, amount: 0 }));
    } else {
      setIsCustomAmount(false);
      setSelectedAmount(amount);
      setFormData((prev) => ({ ...prev, amount }));
    }

    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleInputChange = (field: keyof DonationFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleStartNewDonation = () => {
    reset();
    setFormData({
      name: "",
      email: "",
      phone: "",
      amount: 0,
      payment_for: "general",
      notes: "",
      state: "",
      district: "",
    });
    setErrors({});
    setIsCustomAmount(false);
    setSelectedAmount(null);
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-6">
        <Card className="w-full border-0 shadow-2xl">
          <CardHeader className="text-center bg-primary/5 rounded-t-lg p-4 sm:p-6">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
            <CardTitle className="text-xl sm:text-2xl md:text-3xl text-primary font-bold">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg text-foreground">
              Thank you for your generous contribution to RSS
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            <div className="bg-primary/5 border border-primary/20 p-4 sm:p-6 rounded-lg space-y-3">
              <p className="font-semibold text-primary text-base sm:text-lg">
                Donation Details:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(formData.amount)}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="capitalize text-primary">
                    {formData.payment_for}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="text-primary">
                    {new Date().toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                onClick={handleStartNewDonation}
                className="w-full h-11 sm:h-12 text-base sm:text-lg btn-primary"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Make Another Donation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-2xl mx-auto">
       
        {error && (
          <Alert variant="destructive" className="mb-4 sm:mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border rounded-xl">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
              {/* Impact Amounts Section */}
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 sm:p-5">
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-3 sm:mb-4 text-center">
                  आपका दान कैसे बदलेगा जीवन
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {impactAmounts.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAmountSelect(item.amount)}
                      className={`p-2 sm:p-3 rounded-lg border transition-all text-left ${
                        selectedAmount === item.amount
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-orange-300 dark:border-orange-700 bg-white dark:bg-background hover:border-primary hover:shadow-sm"
                      }`}
                    >
                      <p className="text-sm sm:text-lg font-black text-primary mb-0.5 sm:mb-1">
                        {item.label}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAmountSelect(-1)}
                    className={`p-2 sm:p-3 rounded-lg border transition-all flex flex-col items-center justify-center ${
                      isCustomAmount
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-orange-300 dark:border-orange-700 bg-white dark:bg-background hover:border-primary hover:shadow-sm"
                    }`}
                  >
                    <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-primary mb-0.5 sm:mb-1" />
                    <p className="text-sm sm:text-lg font-black text-primary mb-0.5 sm:mb-1">
                      Custom
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight text-center">
                      अपनी राशि दर्ज करें
                    </p>
                  </button>
                </div>
              </div>

              {isCustomAmount && (
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-foreground mb-2 block text-center">
                    Enter Custom Amount
                  </Label>
                  <div className="max-w-xs mx-auto">
                    <div className="relative">
                      <IndianRupee className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      <Input
                        className="pl-10 sm:pl-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-semibold border-2 focus-ring rounded-xl"
                        type="number"
                        placeholder="0"
                        min={1}
                        max={500000}
                        value={formData.amount || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "amount",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-xs sm:text-sm text-destructive mt-2 text-center">
                        {errors.amount}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {errors.amount && !isCustomAmount && (
                <p className="text-xs sm:text-sm text-destructive text-center">
                  {errors.amount}
                </p>
              )}

              <Separator className="my-4 sm:my-6" />

              <div className="space-y-4 sm:space-y-5">
                <h3 className="text-sm sm:text-base font-semibold text-foreground text-center">
                  Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-foreground">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        className="pl-9 sm:pl-10 h-10 sm:h-12 border-2 focus-ring rounded-lg text-sm sm:text-base"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs sm:text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-medium text-foreground">
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                      <Input
                        className="pl-9 sm:pl-10 h-10 sm:h-12 border-2 focus-ring rounded-lg text-sm sm:text-base"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        maxLength={10}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs sm:text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-medium text-foreground">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                    <Input
                      className="pl-9 sm:pl-10 h-10 sm:h-12 border-2 focus-ring rounded-lg text-sm sm:text-base"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs sm:text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs sm:text-sm font-medium text-foreground">
                    Notes (Optional)
                  </Label>
                  <Input
                    className="h-10 sm:h-12 border-2 focus-ring rounded-lg text-sm sm:text-base"
                    placeholder="Add a personal note"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <StateSelect
                    label="State"
                    placeholder="Select your state"
                    value={formData.state}
                    onStateChange={(stateName, stateId) => {
                      handleInputChange("state", stateName);
                      handleInputChange("district", "");
                      if (stateId) {
                        fetchDistricts(stateId);
                      }
                    }}
                    className="w-full"
                  />

                  <DistrictSelect
                    label="District"
                    placeholder="Select your district"
                    value={formData.district}
                    onValueChange={(value) => handleInputChange("district", value)}
                    stateSelected={!!formData.state}
                    selectedStateId={states.find(s => s.name === formData.state)?.id}
                    selectedStateName={formData.state}
                    className="w-full"
                  />
                </div>
              </div>

              <Separator className="my-4 sm:my-6" />

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-sm sm:text-base font-semibold text-foreground text-center">
                  Choose Purpose
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  {enhancedDonationTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.value}
                        className={`border rounded-lg p-2.5 sm:p-3 cursor-pointer ${
                          formData.payment_for === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                        onClick={() =>
                          handleInputChange("payment_for", type.value)
                        }
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <input
                            type="radio"
                            id={type.value}
                            name="payment_for"
                            value={type.value}
                            checked={formData.payment_for === type.value}
                            onChange={(e) =>
                              handleInputChange("payment_for", e.target.value)
                            }
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary focus:ring-primary/20 flex-shrink-0"
                          />
                          <div className={`p-1.5 sm:p-2 rounded-lg ${type.color}`}>
                            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Label
                              htmlFor={type.value}
                              className="text-xs sm:text-sm font-medium cursor-pointer text-foreground block"
                            >
                              {type.label}
                            </Label>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="my-4 sm:my-6" />

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-muted/30 p-2.5 sm:p-3 rounded-lg border">
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-1">
                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    <span className="text-xs sm:text-sm font-medium text-foreground">
                      100% Secure Payment
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary text-[10px] sm:text-xs"
                    >
                      SSL
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      256-bit encryption • Razorpay • Instant receipt
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 animate-spin" />
                    <span className="text-xs sm:text-base">
                      {currentStep === "creating-order" && "Creating Order..."}
                      {currentStep === "waiting-payment" &&
                        "Opening Payment Gateway..."}
                      {currentStep === "verifying" && "Verifying Payment..."}
                      {!currentStep && "Processing Payment..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                    <span className="text-sm sm:text-base">
                      Donate{" "}
                      {formData.amount > 0
                        ? formatCurrency(formData.amount)
                        : "Now"}
                    </span>
                  </>
                )}
              </Button>

              <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                By proceeding, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default NewDonationForm;
