"use client";

import React, { useState, useEffect } from "react";
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
  Building,
  BookOpen,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { donationAmounts } from "./donationSchema";
import {
  useDonationPayment,
  useCurrency,
  type DonationFormData,
} from "@/module/donation";

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
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);
  const [formData, setFormData] = useState<DonationFormData>({
    name: "",
    email: "",
    phone: "",
    amount: 0,
    payment_for: "general",
    notes: "",
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

  
  const convertNumberToWords = (num: number): string => {
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
  };

  
  useEffect(() => {
    if (success && formData.amount > 0) {
      setTimeout(() => {
        const receiptParams = new URLSearchParams({
          name: formData.name || '',
          phone: formData.phone || '',
          date: new Date().toLocaleDateString('en-IN'),
          mode: 'Online payment',
          amount: String(formData.amount),
          amountWords: convertNumberToWords(formData.amount),
          receiptNumber: 'DONATION_' + Date.now(),
          location: formData.payment_for || 'general'
        });

        const receiptUrl = `/receipt?${receiptParams.toString()}`;
        
        
        const link = document.createElement('a');
        link.href = receiptUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 500);
    }
  }, [success, formData]);

  const enhancedDonationTypes = [
    {
      value: "donation",
      label: "Donation",
      description: "Support overall RSS activities",
      icon: Users,
      color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      value: "member",
      label: "Member",
      description: "Fund educational programs",
      icon: BookOpen,
      color: "bg-green-50 border-green-200 text-green-700",
    },
    {
      value: "volunteer",
      label: "Volunteer",
      description: "Support health initiatives",
      icon: Stethoscope,
      color: "bg-red-50 border-red-200 text-red-700",
    },
    {
      value: "vayapari",
      label: "Vayapari",
      description: "Building & development projects",
      icon: Building,
      color: "bg-purple-50 border-purple-200 text-purple-700",
    },
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
    } catch (error: any) {
      console.error("Payment submission error:", error);
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

  const handleInputChange = (field: keyof DonationFormData, value: any) => {
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
    });
    setErrors({});
    setIsCustomAmount(false);
    setSelectedAmount(null);
    setShowSecurityInfo(false);
  };

  if (success) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="w-full border-0 shadow-2xl">
          <CardHeader className="text-center bg-primary/5 rounded-t-lg">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl text-primary font-bold">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg text-foreground">
              Thank you for your generous contribution to RSS
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg space-y-3">
              <p className="font-semibold text-primary text-lg">
                Donation Details:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                className="w-full h-12 text-lg btn-primary"
              >
                <Heart className="h-5 w-5 mr-2" />
                Make Another Donation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
       
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border rounded-xl">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              {/* Impact Amounts Section */}
              <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-5">
                <h3 className="text-base font-semibold text-foreground mb-4 text-center">
                  आपका दान कैसे बदलेगा जीवन
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {impactAmounts.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAmountSelect(item.amount)}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        selectedAmount === item.amount
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-orange-300 dark:border-orange-700 bg-white dark:bg-background hover:border-primary hover:shadow-sm"
                      }`}
                    >
                      <p className="text-lg font-black text-primary mb-1">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                  {/* Custom Amount Button */}
                  <button
                    type="button"
                    onClick={() => handleAmountSelect(-1)}
                    className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center ${
                      isCustomAmount
                        ? "border-primary bg-primary/10 shadow-md"
                        : "border-orange-300 dark:border-orange-700 bg-white dark:bg-background hover:border-primary hover:shadow-sm"
                    }`}
                  >
                    <Gift className="h-5 w-5 text-primary mb-1" />
                    <p className="text-lg font-black text-primary mb-1">
                      Custom
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight text-center">
                      अपनी राशि दर्ज करें
                    </p>
                  </button>
                </div>
              </div>

              {/* Custom Amount Input */}
              {isCustomAmount && (
                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block text-center">
                    Enter Custom Amount
                  </Label>
                  <div className="max-w-xs mx-auto">
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        className="pl-12 h-14 text-center text-xl font-semibold border-2 focus-ring rounded-xl"
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
                      <p className="text-sm text-destructive mt-2 text-center">
                        {errors.amount}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {errors.amount && !isCustomAmount && (
                <p className="text-sm text-destructive text-center">
                  {errors.amount}
                </p>
              )}

              <Separator className="my-6" />

              <div className="space-y-5">
                <h3 className="text-base font-semibold text-foreground text-center">
                  Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10 h-12 border-2 focus-ring rounded-lg"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Phone Number *
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="pl-10 h-12 border-2 focus-ring rounded-lg"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        maxLength={10}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10 h-12 border-2 focus-ring rounded-lg"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Notes (Optional)
                  </Label>
                  <Input
                    className="h-12 border-2 focus-ring rounded-lg"
                    placeholder="Add a personal note"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-base font-semibold text-foreground text-center">
                  Choose Purpose
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {enhancedDonationTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.value}
                        className={`border rounded-lg p-3 cursor-pointer ${
                          formData.payment_for === type.value
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                        onClick={() =>
                          handleInputChange("payment_for", type.value)
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            id={type.value}
                            name="payment_for"
                            value={type.value}
                            checked={formData.payment_for === type.value}
                            onChange={(e) =>
                              handleInputChange("payment_for", e.target.value)
                            }
                            className="w-4 h-4 text-primary focus:ring-primary/20"
                          />
                          <div className={`p-2 rounded-lg ${type.color}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <Label
                              htmlFor={type.value}
                              className="font-medium cursor-pointer text-foreground"
                            >
                              {type.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="bg-muted/30 p-3 rounded-lg border">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      100% Secure Payment
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary text-xs"
                    >
                      SSL
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Lock className="h-3 w-3" />
                      256-bit encryption • Razorpay • Instant receipt
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold rounded-lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    {currentStep === "creating-order" && "Creating Order..."}
                    {currentStep === "waiting-payment" &&
                      "Opening Payment Gateway..."}
                    {currentStep === "verifying" && "Verifying Payment..."}
                    {!currentStep && "Processing Payment..."}
                  </>
                ) : (
                  <>
                    <Heart className="h-6 w-6 mr-3" />
                    Donate{" "}
                    {formData.amount > 0
                      ? formatCurrency(formData.amount)
                      : "Now"}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
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
