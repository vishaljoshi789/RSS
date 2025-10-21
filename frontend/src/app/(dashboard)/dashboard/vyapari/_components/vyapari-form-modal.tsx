"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Users,
  FileText,
  Image,
  Globe,
  MapPinned,
  Settings,
  MapPinIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import { cn } from "@/lib/utils";
import type { Vyapari, Category, SubCategory } from "../types";

interface VyapariFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vyapari?: Vyapari | null;
  mode: "create" | "edit";
}

const vyapariFormSchema = z.object({
  name: z
    .string()
    .min(1, "Business name is required")
    .min(2, "Business name must be at least 2 characters"),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  logo: z
    .any()
    .refine(
      (val) =>
        val !== undefined &&
        val !== null &&
        !(typeof val === "string" && val.trim() === ""),
      {
        message: "Logo is required",
      }
    ),
  cover_image: z
    .any()
    .refine(
      (val) =>
        val !== undefined &&
        val !== null &&
        !(typeof val === "string" && val.trim() === ""),
      {
        message: "Cover Image is required",
      }
    ),
  category: z.number().nullable().optional(),
  subcategory: z.number().nullable().optional(),
  email: z
    .string()
    .min(1, "Email is mandatory")
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      {
        message: "Please enter a valid email address",
      }
    ),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(10, "Phone number must be at least 10 digits"),
  owner: z.string().optional(),
  referred_by: z.string().optional(),
  insta_url: z.string().optional(),
  facebook_url: z.string().optional(),
  website_url: z.string().optional(),
  address: z
    .object({
      address_line1: z.string().optional(),
      address_line2: z.string().optional(),
      street: z.string().optional(),
      landmark: z.string().optional(),
      sub_district: z.string().optional(),
      market: z.string().optional(),
      district: z.string().min(1, "District is required"),
      state: z.string().optional(),
      postal_code: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  location: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  is_verified: z.boolean().optional(),
  is_blocked: z.boolean().optional(),
  is_business_account: z.boolean().optional(),
});

type VyapariFormValues = z.infer<typeof vyapariFormSchema>;

export default function VyapariFormModal({
  isOpen,
  onClose,
  onSuccess,
  vyapari,
  mode,
}: VyapariFormModalProps) {
  const axios = useAxios();
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategory[]
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [hasCheckedEmail, setHasCheckedEmail] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const form = useForm<VyapariFormValues>({
    resolver: zodResolver(vyapariFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      logo: undefined,
      short_description: undefined,
      long_description: undefined,
      cover_image: undefined,
      category: null,
      subcategory: null,
      email: undefined,
      owner: undefined,
      referred_by: undefined,
      insta_url: undefined,
      facebook_url: undefined,
      website_url: undefined,
      address: {
        address_line1: undefined,
        address_line2: undefined,
        street: undefined,
        landmark: undefined,
        sub_district: undefined,
        market: undefined,
        district: undefined,
        state: undefined,
        postal_code: undefined,
        country: undefined,
      },
      location: {
        latitude: undefined,
        longitude: undefined,
      },
      is_verified: undefined,
      is_blocked: undefined,
      is_business_account: undefined,
    },
  });

  const selectedCategory = form.watch("category");

  useEffect(() => {
    if (isOpen && mode === "create" && user?.user_id) {
      form.setValue("referred_by", user.user_id);
    }
  }, [isOpen, mode, user, form]);

  useEffect(() => {
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
      } catch (error: any) {
        toast.error("Failed to fetch categories");
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, axios]);

  useEffect(() => {
    if (mode === "edit" && vyapari) {
      form.reset({
        name: vyapari.name || "",
        short_description: vyapari.short_description || undefined,
        long_description: vyapari.long_description || undefined,
        logo: vyapari.logo || undefined,
        cover_image: vyapari.cover_image || undefined,
        category: vyapari.category || null,
        subcategory: vyapari.subcategory || null,
        email: vyapari.email || undefined,
        phone: vyapari.phone || "",
        owner: vyapari.owner || undefined,
        referred_by: vyapari.referred_by || undefined,
        insta_url: vyapari.insta_url || undefined,
        facebook_url: vyapari.facebook_url || undefined,
        website_url: vyapari.website_url || undefined,
        address: {
          address_line1: vyapari.address?.address_line1 || undefined,
          address_line2: vyapari.address?.address_line2 || undefined,
          street: vyapari.address?.street || undefined,
          landmark: vyapari.address?.landmark || undefined,
          sub_district: vyapari.address?.sub_district || undefined,
          market: vyapari.address?.market || undefined,
          district: vyapari.address?.district || undefined,
          state: vyapari.address?.state || undefined,
          postal_code: vyapari.address?.postal_code || undefined,
          country: vyapari.address?.country || undefined,
        },
        location: {
          latitude: vyapari.location?.latitude || undefined,
          longitude: vyapari.location?.longitude || undefined,
        },
        is_verified: vyapari.is_verified || undefined,
        is_blocked: vyapari.is_blocked || undefined,
        is_business_account: vyapari.is_business_account || undefined,
      });

      if (vyapari.logo) {
        setLogoPreview(vyapari.logo);
      }
      if (vyapari.cover_image) {
        setCoverImagePreview(vyapari.cover_image);
      }
    } else {
      form.reset();
      setLogoPreview("");
      setCoverImagePreview("");
    }
  }, [mode, vyapari, isOpen, form]);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = subcategories.filter(
        (sub) => sub.category === selectedCategory
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }

    if (form.getValues("subcategory") && selectedCategory) {
      const currentSubcat = form.getValues("subcategory");
      const isValidSubcat = subcategories.some(
        (sub) => sub.id === currentSubcat && sub.category === selectedCategory
      );
      if (!isValidSubcat) {
        form.setValue("subcategory", null);
      }
    }
  }, [selectedCategory, subcategories, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("cover_image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckEmail = async () => {
    const email = form.getValues("email");

    if (!email || !email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setCheckingEmail(true);
    setHasCheckedEmail(true);
    setEmailVerified(false);

    try {
      const response = await axios.get(`/account/list/?email=${email}`);

      if (
        response.data &&
        response.data.results &&
        response.data.results.length > 0
      ) {
        setEmailVerified(true);
        toast.success(
          "Email verified! This email is registered in the system."
        );
      } else {
        setEmailVerified(false);
        toast.error(
          "Email not found. Please ensure you have registered as a user first."
        );
      }
    } catch (error: any) {
      console.error("Error checking email:", error);
      toast.error("Failed to verify email. Please try again.");
      setEmailVerified(false);
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    setFetchingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        form.setValue("location.latitude", latitude);
        form.setValue("location.longitude", longitude);

        toast.success(
          `Location fetched successfully! Lat: ${latitude.toFixed(
            6
          )}, Lng: ${longitude.toFixed(6)}`
        );
        setFetchingLocation(false);
      },
      (error) => {
        let errorMessage = "Failed to get location. ";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "Unknown error occurred.";
            break;
        }

        toast.error(errorMessage);
        setFetchingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const onSubmit = async (values: VyapariFormValues) => {
    try {
      setSubmitting(true);

      const hasFiles =
        values.logo instanceof File || values.cover_image instanceof File;

      let response;

      if (hasFiles) {
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("phone", values.phone);

        if (values.short_description)
          formData.append("short_description", values.short_description);
        if (values.long_description)
          formData.append("long_description", values.long_description);
        if (values.logo instanceof File) formData.append("logo", values.logo);
        if (values.cover_image instanceof File)
          formData.append("cover_image", values.cover_image);
        if (values.category)
          formData.append("category", values.category.toString());
        if (values.subcategory)
          formData.append("subcategory", values.subcategory.toString());
        if (values.email) formData.append("email", values.email);
        if (values.owner) formData.append("owner", values.owner);
        if (values.referred_by)
          formData.append("referred_by", values.referred_by);
        if (values.insta_url) formData.append("insta_url", values.insta_url);
        if (values.facebook_url)
          formData.append("facebook_url", values.facebook_url);
        if (values.website_url)
          formData.append("website_url", values.website_url);

        formData.append(
          "is_verified",
          (values.is_verified ?? false).toString()
        );
        formData.append("is_blocked", (values.is_blocked ?? false).toString());
        formData.append(
          "is_business_account",
          (values.is_business_account ?? false).toString()
        );

        if (values.address) {
          Object.keys(values.address).forEach((key) => {
            const value = values.address![key as keyof typeof values.address];
            if (value && value.trim() !== "") {
              formData.append(`address.${key}`, value);
            }
          });
        }

        if (values.location?.latitude)
          formData.append(
            "location.latitude",
            values.location.latitude.toString()
          );
        if (values.location?.longitude)
          formData.append(
            "location.longitude",
            values.location.longitude.toString()
          );

        if (mode === "create") {
          response = await axios.post("/vyapari/vyapari/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          response = await axios.put(
            `/vyapari/vyapari/${vyapari?.id}/`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        }
      } else {
        const cleanData: any = {
          name: values.name,
          phone: values.phone,
          short_description: values.short_description || null,
          long_description: values.long_description || null,
          category: values.category || null,
          subcategory: values.subcategory || null,
          email:
            values.email && values.email.trim() !== "" ? values.email : null,
          owner: values.owner || null,
          referred_by: values.referred_by || null,
          insta_url: values.insta_url || null,
          facebook_url: values.facebook_url || null,
          website_url: values.website_url || null,
          is_verified: values.is_verified ?? false,
          is_blocked: values.is_blocked ?? false,
          is_business_account: values.is_business_account ?? false,
        };

        if (
          values.address &&
          Object.values(values.address).some((val) => val && val.trim() !== "")
        ) {
          cleanData.address = {};
          Object.keys(values.address).forEach((key) => {
            const value = values.address![key as keyof typeof values.address];
            cleanData.address[key] =
              value && value.trim() !== "" ? value : null;
          });
        } else {
          cleanData.address = {};
        }

        if (
          values.location &&
          (values.location.latitude || values.location.longitude)
        ) {
          cleanData.location = {
            latitude: values.location.latitude || null,
            longitude: values.location.longitude || null,
          };
        } else {
          cleanData.location = {};
        }

        if (mode === "create") {
          response = await axios.post("/vyapari/vyapari/", cleanData);
        } else {
          response = await axios.put(
            `/vyapari/vyapari/${vyapari?.id}/`,
            cleanData
          );
        }
      }

      toast.success(
        mode === "create"
          ? "Business created successfully"
          : "Business updated successfully"
      );

      onSuccess();
      onClose();
    } catch (error: any) {
      if (error.response?.data) {
        const errors = error.response.data;

        Object.keys(errors).forEach((field) => {
          if (Array.isArray(errors[field]) && errors[field][0]) {
            let formFieldName = field;

            if (field.includes(".")) {
              formFieldName = field;
            }

            try {
              form.setError(formFieldName as any, {
                type: "server",
                message: errors[field][0],
              });
            } catch (e) {
              toast.error(`${field}: ${errors[field][0]}`);
            }
          }
        });

        const primaryError =
          errors.name?.[0] ||
          errors.phone?.[0] ||
          errors.email?.[0] ||
          errors.logo?.[0] ||
          errors.non_field_errors?.[0] ||
          errors.detail ||
          `Failed to ${mode} business`;

        toast.error(primaryError);
      } else {
        toast.error(`Failed to ${mode} business. Please try again.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Business" : "Edit Business"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to add a new business to the directory"
              : "Update the business information"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Basic Business Information */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Basic Business Information
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Essential business contact details
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Business Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Business owner name"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+91 1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="text-red-500">* </span>
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                  type="email"
                                  placeholder="business@example.com"
                                  className={`pl-10 ${
                                    hasCheckedEmail
                                      ? emailVerified
                                        ? "border-green-500 focus-visible:ring-green-500"
                                        : "border-red-500 focus-visible:ring-red-500"
                                      : ""
                                  }`}
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    setEmailVerified(false);
                                    setHasCheckedEmail(false);
                                  }}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleCheckEmail}
                                disabled={checkingEmail || !field.value}
                              >
                                {checkingEmail ? "Checking..." : "Check"}
                              </Button>
                            </div>
                            {hasCheckedEmail && (
                              <p
                                className={`text-sm ${
                                  emailVerified
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {emailVerified
                                  ? "✓ Email verified successfully"
                                  : "✗ Email not found in the system"}
                              </p>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="referred_by"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referred By (Staff ID)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                              placeholder="Auto-filled with your user ID"
                              className="pl-10 bg-gray-50"
                              {...field}
                              value={field.value || ""}
                              disabled={true}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Auto-filled with your user ID
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Business Details */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Business Category & Description
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Classify and describe your business
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value ? Number(value) : null)
                        }
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value ? Number(value) : null)
                        }
                        value={field.value ? String(field.value) : ""}
                        disabled={
                          !selectedCategory ||
                          filteredSubcategories.length === 0
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredSubcategories.map((subcategory) => (
                            <SelectItem
                              key={subcategory.id}
                              value={String(subcategory.id)}
                            >
                              {subcategory.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description (1-2 lines)"
                            rows={2}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="long_description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Long Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of your business"
                          rows={4}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 3: Media & Branding */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Media & Branding
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Upload logo and cover image
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                          {logoPreview && (
                            <div className="mt-2">
                              <img
                                src={logoPreview}
                                alt="Logo preview"
                                className="h-24 w-24 object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cover_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                          />
                          {coverImagePreview && (
                            <div className="mt-2">
                              <img
                                src={coverImagePreview}
                                alt="Cover image preview"
                                className="h-32 w-full object-cover rounded border"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 4: Online Presence */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Online Presence
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Social media and website links
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insta_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/username"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facebook_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/page"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 5: Address Information */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address Information
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Complete business location details
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address.address_line1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Address Line 1 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="House/Building number, Street"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.address_line2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Area, Locality"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Street name"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.landmark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Landmark</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Near landmark"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.market"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Market <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Market name"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        District <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="District name"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="State name"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Postal/ZIP code"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Country name"
                          {...field}
                          value={field.value || "India"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.sub_district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sub District</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Sub district/Tehsil"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 6: Location Coordinates */}
            <div className="space-y-4">
              <div className="border-b pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPinned className="h-5 w-5" />
                      Location Coordinates
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      GPS coordinates (optional)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetCurrentLocation}
                    disabled={fetchingLocation}
                    className="flex items-center gap-2"
                  >
                    <MapPinIcon className="h-4 w-4" />
                    {fetchingLocation
                      ? "Getting Location..."
                      : "Get Current Location"}
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location.latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="any"
                            placeholder={
                              fetchingLocation
                                ? "Fetching latitude..."
                                : "e.g., 28.6139"
                            }
                            {...field}
                            value={field.value || ""}
                            disabled={fetchingLocation}
                            className={cn(
                              fetchingLocation && "animate-pulse bg-muted"
                            )}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                          />
                          {fetchingLocation && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            step="any"
                            placeholder={
                              fetchingLocation
                                ? "Fetching longitude..."
                                : "e.g., 77.2090"
                            }
                            {...field}
                            value={field.value || ""}
                            disabled={fetchingLocation}
                            className={cn(
                              fetchingLocation && "animate-pulse bg-muted"
                            )}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseFloat(e.target.value)
                                  : undefined
                              )
                            }
                          />
                          {fetchingLocation && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 7: Account Settings (only in edit mode) */}
            {mode === "edit" && (
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage account features and status
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="is_business_account"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value || false}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-medium">
                          Business Account
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Enable business account features for this vyapari.
                          Usually enabled automatically when business is
                          verified.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={submitting}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Business"
                  : "Update Business"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
