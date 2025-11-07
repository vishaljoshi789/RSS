"use client";

import { useEffect, useMemo, useState, useRef, type ChangeEvent } from "react";
import {
  CheckCircle2,
  Loader2,
  CreditCard,
  IndianRupee,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  PersonalDetailsStep,
  AddressStep,
  PhotoUploadStep,
  ReviewStep,
} from "@/module/dashboard/member/components";
import { useMemberSubmit } from "@/module/dashboard/member/hooks";
import { useDonationPayment } from "@/module/donation";
import rawStateDistrictData from "@/lib/state-district.json";
import { useAuth } from "@/context/AuthContext";

type FormState = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  profession: string;
  city: string;
  sub_district: string;
  district: string;
  state: string;
  postal_code: string;
  image: File | null;
  referred_by?: string;
};



const defaultFormState: FormState = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  profession: "",
  city: "",
  sub_district: "",
  district: "",
  state: "",
  postal_code: "",
  image: null,
  referred_by: "",
};

type StateDistrictData = typeof rawStateDistrictData;

const getIndianStates = (data: StateDistrictData): string[] => {
  if (!data?.India) return [];
  return Object.keys(data.India).sort((a, b) => a.localeCompare(b));
};

type StepConfig = {
  title: string;
  description: string;
};

const steps: StepConfig[] = [
  {
    title: "Personal details",
    description: "Tell us a little about yourself.",
  },
  {
    title: "Address",
    description: "Where can we reach you?",
  },
  {
    title: "Identification",
    description: "Upload a recent passport size photo.",
  },
  {
    title: "Review & payment",
    description: "Confirm everything looks correct.",
  },
];

const BecomeMemberPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formDataRef = useRef<{
    name: string;
    phone: string;
    email: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  }>({
    name: "",
    phone: "",
    email: "",
  });

  const { user } = useAuth();
  const stateOptions = useMemo(() => getIndianStates(rawStateDistrictData), []);

  // Pre-fill form from authenticated user data (from AuthContext only, no localStorage)
  useEffect(() => {
    if (userDataLoaded || !user) {
      return;
    }

    setFormState((prev) => {
      const updated = { ...prev };

      const safeGet = (key: string) => {
        const value = user?.[key as keyof typeof user];
        if (value === undefined || value === null || value === "")
          return undefined;
        return String(value);
      };

      const maybeName = safeGet("name");
      if (!updated.name && maybeName) {
        updated.name = maybeName;
      }

      const maybeEmail = safeGet("email");
      if (!updated.email && maybeEmail) {
        updated.email = maybeEmail;
      }

      const maybeDob = safeGet("dob");
      if (!updated.dob && maybeDob) {
        updated.dob = maybeDob;
      }

      const maybeGender = safeGet("gender");
      if (!updated.gender && maybeGender) {
        updated.gender = maybeGender.toLowerCase();
      }

      const maybePhone = safeGet("phone");
      if (!updated.phone && maybePhone) {
        updated.phone = maybePhone;
      }

      const maybeProfession = safeGet("profession");
      if (!updated.profession && maybeProfession) {
        updated.profession = maybeProfession
          .toLowerCase()
          .replace(/\s+/g, "-");
      }

      const maybeCity = safeGet("city");
      if (!updated.city && maybeCity) {
        updated.city = maybeCity;
      }

      const maybeSubDistrict = safeGet("sub_district");
      if (!updated.sub_district && maybeSubDistrict) {
        updated.sub_district = maybeSubDistrict;
      }

      const maybeDistrict = safeGet("district");
      if (!updated.district && maybeDistrict) {
        updated.district = maybeDistrict;
      }

      const maybeState = safeGet("state");
      if (!updated.state && maybeState) {
        const matchedState = stateOptions.find(
          (option) => option.toLowerCase() === maybeState.toLowerCase()
        );
        updated.state = matchedState || maybeState;
      }

      const maybePostal = safeGet("postal_code");
      if (!updated.postal_code && maybePostal) {
        updated.postal_code = maybePostal;
      }

      const maybeReferral = safeGet("referred_by");
      if (!updated.referred_by && maybeReferral) {
        updated.referred_by = maybeReferral;
      }

      return updated;
    });

    setUserDataLoaded(true);
  }, [user, userDataLoaded, stateOptions]);

  const handleChange = (field: string, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "File must be smaller than 5MB.",
      }));
      setFormState((prev) => ({ ...prev, image: null }));
      event.target.value = "";
      return;
    }

    setFormState((prev) => ({ ...prev, image: file }));
    if (errors.image) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.image;
        return next;
      });
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!formState.name.trim()) {
        stepErrors.name = "Please enter your full name.";
      }
      if (!formState.email.trim()) {
        stepErrors.email = "Please provide an email address.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
        stepErrors.email = "Please enter a valid email address.";
      }
      if (!formState.dob.trim()) {
        stepErrors.dob = "Date of birth is required.";
      }
      if (!formState.gender.trim()) {
        stepErrors.gender = "Please select your gender.";
      }
      if (!formState.phone.trim()) {
        stepErrors.phone = "Mobile number is required.";
      }
      if (!formState.profession.trim()) {
        stepErrors.profession = "Select your profession.";
      }
    }

    if (stepIndex === 1) {
      if (!formState.city.trim()) {
        stepErrors.city = "Village or city name is required.";
      }
      if (!formState.sub_district.trim()) {
        stepErrors.sub_district = "Please provide your tehsil.";
      }
      if (!formState.district.trim()) {
        stepErrors.district = "District is required.";
      }
      if (!formState.state.trim()) {
        stepErrors.state = "Select your state.";
      }
      if (!formState.postal_code.trim()) {
        stepErrors.postal_code = "PIN code is required.";
      }
    }

    if (stepIndex === 2) {
      if (!formState.image) {
        stepErrors.image = "Please upload a recent photograph.";
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(activeStep)) {
      toast.error("Please fill in all required fields correctly.", {
        description: "Check the form for any errors highlighted in red.",
      });
      return;
    }

    setErrors({});
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setErrors({});
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setFormState(defaultFormState);
    setActiveStep(0);
    setSubmitted(false);
    setErrors({});
  };

  const { refreshUserData } = useAuth();
  const { submitMemberForm, loading: isMemberSubmitting } = useMemberSubmit();
  const {
    processPayment,
    isProcessing: isPaymentProcessing,
    success: paymentSuccess,
    error: paymentError,
  } = useDonationPayment();

  const isSubmitting = isMemberSubmitting || isPaymentProcessing;

  useEffect(() => {
    if (paymentSuccess && !submitted) {
      const savedFormData = formDataRef.current;

      toast.success("Payment completed successfully!", {
        duration: 5000,
      });

      setSubmitted(true);

      
        const receiptParams = new URLSearchParams({
          name: savedFormData.name || "",
          phone: savedFormData.phone || "",
          date: new Date().toLocaleDateString("en-IN"),
          mode: "Online payment",
          amount: "199",
          amountWords: "One Hundred Ninety Nine Rupees Only",
          receiptNumber: "MEMBER_" + Date.now(),
          country: savedFormData.country || "India",
          state: savedFormData.state || "",
          city: savedFormData.city || "",
          postal_code: savedFormData.postal_code || "",
        });

        const receiptUrl = `/receipt?${receiptParams.toString()}`;

        const link = document.createElement("a");
        link.href = receiptUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }, [paymentSuccess, submitted]);

  useEffect(() => {
    if (paymentError) {
      const isAlreadyMemberError =
        paymentError.toLowerCase().includes("already a member") ||
        paymentError.toLowerCase().includes("user already a member");

      if (isAlreadyMemberError) {
        setIsAlreadyMember(true);
        toast.error("Already a Member!", {
          duration: 8000,
          description:
            "You are already registered as a member. You cannot register again.",
        });
      } else {
        toast.error(paymentError, {
          duration: 5000,
          description: "If the problem persists, please contact support.",
        });
      }
      setShowPaymentModal(false);
    }
  }, [paymentError]);

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      formDataRef.current = {
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        city: formState.city,
        state: formState.state,
        postal_code: formState.postal_code,
        country: (formState as any).country || "India",
      };

      // Step 1: Register member
      toast.loading("Registering membership...", { id: "member-registration" });
      await submitMemberForm(formState);

      toast.dismiss("member-registration");
      setShowPaymentModal(false);

      // Step 2: Refresh user data to sync address updates
      await refreshUserData();

      // Step 3: Process payment
      toast.loading("Opening payment gateway...", { id: "payment-processing" });

      await processPayment({
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        amount: 199 * 100,
        payment_for: "member",
        notes: `Membership registration for ${formState.name}`,
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

      const isAlreadyMemberError =
        errorMessage.toLowerCase().includes("already a member") ||
        errorMessage.toLowerCase().includes("user already a member");

      if (isAlreadyMemberError) {
        setIsAlreadyMember(true);
        toast.error("Already a Member!", {
          duration: 8000,
          description:
            "You are already registered as a member. Please log in to access your account or contact support if you need assistance.",
        });
      } else {
        toast.error(errorMessage, {
          duration: 5000,
          description: "If the problem persists, please contact support.",
        });
      }

      setShowPaymentModal(false);
    }
  };

  const renderStepContent = () => {
    if (activeStep === 0) {
      return (
        <PersonalDetailsStep
          formData={formState}
          errors={errors}
          onChange={handleChange}
        />
      );
    }

    if (activeStep === 1) {
      return (
        <AddressStep
          formData={formState}
          errors={errors}
          onChange={handleChange}
          stateOptions={stateOptions}
        />
      );
    }

    if (activeStep === 2) {
      return (
        <PhotoUploadStep
          formData={formState}
          errors={errors}
          onFileChange={handleFileChange}
        />
      );
    }

    return <ReviewStep formData={formState} />;
  };

  if (submitted) {
    return (
      <section className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 sm:gap-5 rounded-xl border bg-card p-4 sm:p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-semibold text-foreground">
              Payment details captured
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm px-2">
              Thanks for confirming your membership information. We&apos;ll
              email you a receipt and next steps shortly.
            </p>
          </div>
        </div>
        <Button className="mt-2 w-full sm:w-auto" onClick={handleReset} size="sm">
          Download pdf
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-screen w-full items-center justify-center px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col lg:flex-row w-full lg:max-w-5xl gap-4 sm:gap-6 rounded-xl border bg-card p-3 sm:p-6">
        <div className="flex w-full flex-col gap-4 sm:gap-6">
          <div className="space-y-1.5">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
              Membership interest form
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Complete the short form below to let us know how you&apos;d like
              to contribute.
            </p>
          </div>

          {isAlreadyMember && (
            <Alert
              variant="destructive"
              className="border-red-500 bg-red-50 dark:bg-red-950"
            >
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-semibold">
                Already a Member!
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-3">
                <p>
                  You are already registered as a member of our organization.
                  Please log in to your account to access your membership
                  details.
                </p>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => (window.location.href = "/login")}
                  className="mt-2"
                >
                  Go to Login
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="mt-4 sm:mt-6 overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0">
            <div className="flex items-center gap-2 sm:gap-4 min-w-max">
              {steps.map((step, index) => {
                const isActive = index === activeStep;
                const isCompleted = index < activeStep;

                return (
                  <div key={step.title} className="flex items-center gap-1.5 sm:gap-2">
                    <div
                      className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-colors ${
                        isActive || isCompleted
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                      ) : (
                        <span className="text-xs sm:text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium whitespace-nowrap ${
                        isActive || isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div className="h-0.5 w-8 sm:w-12 bg-muted-foreground/30 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border bg-background p-3 sm:p-5 w-full">
            {renderStepContent()}
          </div>

          <div className="flex flex-row justify-between gap-3 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={activeStep === 0 || isSubmitting || isAlreadyMember}
              className="w-auto"
            >
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting || isAlreadyMember}
                className="w-auto"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || isAlreadyMember}
                className="w-auto"
              >
                {isSubmitting ? "Submitting..." : "Review & Pay"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md mx-auto">
          <DialogHeader>
            <div className="mx-auto flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10">
              <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <DialogTitle className="text-center text-lg sm:text-xl">
              Membership Payment
            </DialogTitle>
            <DialogDescription className="text-center text-xs sm:text-sm">
              Complete your RSS membership registration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 sm:space-y-3 py-2 sm:py-3">
            <div className="rounded-lg border bg-muted/30 p-2.5 sm:p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Membership Fee
                </span>
                <span className="text-lg sm:text-xl font-bold text-foreground">₹199</span>
              </div>
              <p className="mt-1 sm:mt-1.5 text-xs text-muted-foreground">
                One-time registration fee for RSS membership
              </p>
            </div>

            <div className="space-y-1.5 sm:space-y-2 rounded-lg border border-dashed bg-background p-2.5 sm:p-3">
              <h4 className="text-xs sm:text-sm font-medium text-foreground">
                What you get:
              </h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-start sm:items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>Official RSS membership certificate</span>
                </li>
                <li className="flex items-start sm:items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>Access to training programs & events</span>
                </li>
                <li className="flex items-start sm:items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>Connect with RSS community nationwide</span>
                </li>
                <li className="flex items-start sm:items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span>Monthly newsletters & updates</span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handlePaymentConfirm}
              disabled={isSubmitting}
              className="w-full gap-2 sm:w-auto"
            >
              {isMemberSubmitting ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="text-xs sm:text-sm">Registering...</span>
                </>
              ) : isPaymentProcessing ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span className="text-xs sm:text-sm">Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Pay ₹199</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BecomeMemberPage;
