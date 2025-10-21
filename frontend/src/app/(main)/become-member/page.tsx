"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  CheckCircle2,
  Loader2,
  CreditCard,
  IndianRupee,
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
import {
  PersonalDetailsStep,
  AddressStep,
  PhotoUploadStep,
  ReviewStep,
} from "@/module/dashboard/member/components";
import { useMemberSubmit } from "@/module/dashboard/member/hooks";
import { useDonationPayment } from "@/module/donation";
import rawStateDistrictData from "@/lib/state-district.json";

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

type PersistedKey = Exclude<keyof FormState, "image">;
type PersistedFormData = Pick<FormState, PersistedKey>;

const PERSISTED_FIELDS: PersistedKey[] = [
  "name",
  "email",
  "phone",
  "dob",
  "gender",
  "profession",
  "city",
  "sub_district",
  "district",
  "state",
  "postal_code",
  "referred_by",
];

const FORM_STORAGE_KEY = "rss-membership-form";

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
type StateKey = keyof StateDistrictData["India"];

const isStateKey = (
  value: string,
  data: StateDistrictData
): value is StateKey =>
  Boolean(value) && Object.prototype.hasOwnProperty.call(data.India, value);

const getIndianStates = (data: StateDistrictData): string[] => {
  if (!data?.India) return [];
  return Object.keys(data.India).sort((a, b) => a.localeCompare(b));
};

const getDistrictsForState = (
  data: StateDistrictData,
  stateName: string
): string[] => {
  if (!stateName || !isStateKey(stateName, data)) return [];
  const districts = data.India[stateName]?.districts || {};
  return Object.keys(districts).sort((a, b) => a.localeCompare(b));
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
  const [storageHydrated, setStorageHydrated] = useState(false);
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stateOptions = useMemo(
    () => getIndianStates(rawStateDistrictData),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined" || storageHydrated) {
      return;
    }

    try {
      const storedFormValue = window.localStorage.getItem(FORM_STORAGE_KEY);

      const storedUserData = window.localStorage.getItem("user_data");

      let userData: Record<string, any> | null = null;
      if (storedUserData) {
        try {
          const parsed = JSON.parse(storedUserData);
          if (parsed && typeof parsed === "object") {
            userData =
              (parsed as { user_info?: Record<string, any> }).user_info ||
              parsed;
          }
        } catch (e) {
          console.warn("Unable to parse user_data from localStorage", e);
        }
      }

      setFormState((prev) => {
        const updated = { ...prev };

        if (storedFormValue) {
          const parsed = JSON.parse(
            storedFormValue
          ) as Partial<PersistedFormData>;
          PERSISTED_FIELDS.forEach((key) => {
            const value = parsed[key];
            if (typeof value === "string" && value.trim() !== "") {
              updated[key] = value;
            }
          });
        }
        if (userData) {
          const safeGet = (key: string) => {
            const value = userData?.[key];
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
        }

        return updated;
      });
    } catch (error) {
      console.warn("Unable to read stored membership form data", error);
    } finally {
      setStorageHydrated(true);
    }
  }, [storageHydrated, stateOptions]);

  useEffect(() => {
    if (!storageHydrated || typeof window === "undefined") {
      return;
    }

    const payload = PERSISTED_FIELDS.reduce((acc, key) => {
      const value = formState[key];
      if (typeof value === "string" && value.trim() !== "") {
        acc[key] = value;
      }
      return acc;
    }, {} as Partial<PersistedFormData>);

    if (Object.keys(payload).length > 0) {
      try {
        window.localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(payload));
      } catch (error) {
        console.warn("Unable to persist form data", error);
      }
    } else {
      window.localStorage.removeItem(FORM_STORAGE_KEY);
    }
  }, [formState, storageHydrated]);

  const clearStoredForm = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(FORM_STORAGE_KEY);
    }
  };

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
    clearStoredForm();
    setActiveStep(0);
    setSubmitted(false);
    setErrors({});
  };

  const { submitMemberForm, loading: isMemberSubmitting } = useMemberSubmit();
  const { processPayment, isProcessing: isPaymentProcessing } =
    useDonationPayment();

  const isSubmitting = isMemberSubmitting || isPaymentProcessing;

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      // Step 1: Register member
      toast.loading("Registering membership...", { id: "member-registration" });
      await submitMemberForm(formState);
      toast.success("Registration successful!", { id: "member-registration" });

      // Step 2: Process payment
      toast.loading("Opening payment gateway...", { id: "payment-processing" });
      await processPayment({
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        amount: 300 * 100,
        payment_for: "member",
        notes: `Membership registration for ${formState.name}`,
      });
      toast.success("Payment completed successfully!", {
        id: "payment-processing",
      });

      clearStoredForm();
      setShowPaymentModal(false);
      setSubmitted(true);
    } catch (error: any) {
      console.error("Registration or payment failed:", error);

      toast.dismiss("member-registration");
      toast.dismiss("payment-processing");

      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again later.";

      toast.error(errorMessage, {
        duration: 5000,
        description: "If the problem persists, please contact support.",
      });

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
      <section className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-5 rounded-xl border bg-card p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-6 w-6" />
          </span>
          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold text-foreground">
              Payment details captured
            </h2>
            <p className="text-muted-foreground text-sm">
              Thanks for confirming your membership information. We&apos;ll
              email you a receipt and next steps shortly.
            </p>
          </div>
        </div>
        <Button className="mt-2" onClick={handleReset} size="sm">
          Fill the form again
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-4 py-8">
      <div className="flex w-full flex-col gap-6 rounded-xl border bg-card p-5 sm:p-6">
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            Membership interest form
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete the short form below to let us know how you&apos;d like to
            contribute.
          </p>
        </div>

        <nav
          aria-label="Steps"
          className="rounded-lg border bg-background px-5 py-5"
        >
          <ol className="flex items-center justify-between gap-3 relative">
            <div className="absolute left-0 right-0 top-4 flex items-center px-8">
              <div className="h-0.5 w-full bg-border" />
            </div>

            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;

              return (
                <li
                  key={step.title}
                  className="flex flex-1 flex-col items-center gap-1.5 relative z-10"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={`text-xs font-medium text-center ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="rounded-lg border bg-background p-5">
          {renderStepContent()}
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={activeStep === 0 || isSubmitting}
          >
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext} disabled={isSubmitting}>
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Review & Pay"}
            </Button>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <IndianRupee className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-center text-xl">
              Membership Payment
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Complete your RSS membership registration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Membership Fee
                </span>
                <span className="text-xl font-bold text-foreground">₹300</span>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                One-time registration fee for RSS membership
              </p>
            </div>

            <div className="space-y-2 rounded-lg border border-dashed bg-background p-3">
              <h4 className="text-sm font-medium text-foreground">
                What you get:
              </h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                  Official RSS membership certificate
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                  Access to training programs & events
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                  Connect with RSS community nationwide
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                  Monthly newsletters & updates
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
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : isPaymentProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay ₹300
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
