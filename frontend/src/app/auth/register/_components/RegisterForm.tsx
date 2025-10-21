"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { registerFormSchema, type RegisterFormData } from "./registerSchema";
import {
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Lock,
  Key,
  CheckCircle,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { format } from "date-fns";
import { hi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const RegisterForm = () => {
  const searchParams = useSearchParams();
  const referralParam = searchParams.get("ref") || "";

  const [showReferralCode, setShowReferralCode] = useState(
    Boolean(referralParam)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const router = useRouter();
  const { register: registerUser } = useAuth();

  const containsHindi = (text: string) => {
    return /[\u0900-\u097F]/.test(text);
  };

  const handleEnglishOnlyInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const char = e.key;
    if (containsHindi(char) || /[\u0900-\u097F]/.test(char)) {
      e.preventDefault();
      return false;
    }
  };

  const handleEnglishOnlyPaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const pastedText = e.clipboardData.getData("text");
    if (containsHindi(pastedText)) {
      e.preventDefault();
      toast.error("कृपया केवल अंग्रेजी में टाइप करें (हिंदी में नहीं)");
      return false;
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.slice(0, 10);
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dateOfBirth: undefined,
      referralCode: referralParam,
    },
  });

  useEffect(() => {
    if (referralParam) {
      setShowReferralCode(true);
      form.setValue("referralCode", referralParam, { shouldValidate: true });
    }
  }, [referralParam, form]);

  const onSubmit = async (
    data: RegisterFormData,
    event?: React.BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    setIsLoading(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      const referredBy = data.referralCode?.trim();

      const registrationData = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone.trim(),
        dob: format(data.dateOfBirth, "yyyy-MM-dd"),
        referred_by: referredBy ? referredBy : null,
      };

      console.log("Sending registration data:", registrationData);

      const result = await registerUser(registrationData);

      if (result.success) {
        setSubmitStatus("success");
        setSubmitMessage(
          "पंजीकरण सफल हुआ! आपका पासवर्ड आपकी जन्म तिथि है। कृपया लॉगिन करें।"
        );

        toast.success("पंजीकरण सफल हुआ!");

        form.reset();

        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      } else {
        setSubmitMessage(
          result.message || "पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।"
        );
        toast.error(result.message || "पंजीकरण असफल");
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      let errorMessage = "पंजीकरण में त्रुटि हुई। कृपया पुनः प्रयास करें।";

      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setSubmitStatus("error");
      setSubmitMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card className="shadow-sm border border-border bg-card">
        <CardHeader className="space-y-3 text-center py-6">
          
          <CardTitle className="text-2xl font-semibold text-foreground">
            नया खाता बनाएं
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 px-6 pb-6">
          {submitStatus === "success" && (
            <Alert className="border-green-200 bg-green-50 dark:bg-green-950/50 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">{submitMessage}</p>
                  <p className="text-xs">
                    आप 3 सेकंड में लॉगिन पेज पर पहुंच जाएंगे...
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === "error" && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/50 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
                {submitMessage}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <User className="w-3 h-3 text-primary" />
                        पूरा नाम
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="अपना पूरा नाम दर्ज करें"
                          className="h-9 text-sm placeholder:text-foreground/60"
                          onKeyPress={handleEnglishOnlyInput}
                          onPaste={handleEnglishOnlyPaste}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Mail className="w-3 h-3 text-primary" />
                        ईमेल पता
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@domain.com"
                          className="h-9 text-sm placeholder:text-foreground/60"
                          onKeyPress={handleEnglishOnlyInput}
                          onPaste={handleEnglishOnlyPaste}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Phone className="w-3 h-3 text-primary" />
                        मोबाइल नंबर
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="9876543210"
                          className="h-9 text-sm placeholder:text-foreground/60"
                          type="tel"
                          maxLength={10}
                          {...field}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <CalendarIcon className="w-3 h-3 text-primary" />
                        जन्म तिथि
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-9 justify-start text-left font-normal text-sm",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3 text-primary" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: hi })
                              ) : (
                                <span>तारीख चुनें</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                const age = calculateAge(date);
                                if (age < 18) {
                                  toast.error("आयु 18 वर्ष से कम है");
                                  return;
                                }
                                if (age > 100) {
                                  toast.error("आयु 100 वर्ष से अधिक है");
                                  return;
                                }
                              }
                              field.onChange(date);
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-xs text-destructive" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-md border border-border/60 bg-muted p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    पासवर्ड की जानकारी
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  पंजीकरण के बाद आपका पासवर्ड आपकी जन्म तिथि होगी (YYYYMMDD
                  format में)।
                </p>
                <div className="rounded bg-card px-2 py-1">
                  <p className="text-xs text-muted-foreground">
                    <strong>उदाहरण:</strong> जन्म तिथि 15/01/1990 = पासवर्ड:
                    <code className="ml-1 rounded bg-muted px-1 py-0.5 text-xs font-mono text-foreground/80">
                      19900115
                    </code>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary hover:text-primary/80 text-sm"
                  onClick={() => setShowReferralCode(!showReferralCode)}
                >
                  <div className="flex items-center gap-2">
                    <Key className="w-3 h-3" />
                    {showReferralCode ? "रेफरल कोड छुपाएं" : "रेफरल कोड है?"}
                  </div>
                </Button>

                {showReferralCode && (
                  <FormField
                    control={form.control}
                    name="referralCode"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormControl>
                          <Input
                            placeholder={referralParam ? "रेफरल कोड (URL से आया है)" : "रेफरल कोड दर्ज करें"}
                            className={cn(
                              "h-9 text-sm placeholder:text-foreground/60",
                              referralParam && "bg-muted cursor-not-allowed"
                            )}
                            disabled={Boolean(referralParam)}
                            readOnly={Boolean(referralParam)}
                            onKeyPress={handleEnglishOnlyInput}
                            onPaste={handleEnglishOnlyPaste}
                            {...field}
                          />
                        </FormControl>
                        {referralParam && (
                          <p className="text-xs text-muted-foreground">
                            यह रेफरल कोड URL से आया है और इसे बदला नहीं जा सकता
                          </p>
                        )}
                        <FormMessage className="text-xs text-destructive" />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-10 text-sm font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    पंजीकरण हो रहा है...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    पंजीकरण करें
                  </div>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center pt-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              पहले से खाता है?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:text-primary/80 font-medium hover:underline"
              >
                लॉगिन करें
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
