"use client";

import { useState, useEffect } from "react";
import { Building2, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type { Vyapari, Category, SubCategory } from "../types";

interface VyapariFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  vyapari?: Vyapari | null;
  mode: "create" | "edit";
}

const BUSINESS_TYPES = [
  "Retail",
  "Wholesale",
  "Manufacturing",
  "Service",
  "Restaurant",
  "Healthcare",
  "Education",
  "Technology",
  "Construction",
  "Other",
];

const vyapariFormSchema = z.object({
  name: z
    .string()
    .min(1, "Business name is required")
    .min(2, "Business name must be at least 2 characters"),
  short_description: z.string().optional(),
  long_description: z.string().optional(),
  logo: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      {
        message: "Please enter a valid URL",
      }
    ),
  cover_image: z.string().optional(),
  business_type: z.string().min(1, "Business type is required"),
  category: z.number().nullable().optional(),
  subcategory: z.number().nullable().optional(),
  email: z
    .string()
    .optional()
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
  employee_count: z.number().nullable().optional(),
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
      city: z.string().optional(),
      district: z.string().optional(),
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

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategory[]
  >([]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<VyapariFormValues>({
    resolver: zodResolver(vyapariFormSchema),
    defaultValues: {
      name: "",
      business_type: "Retail",
      phone: "",
      logo: undefined,
      short_description: undefined,
      long_description: undefined,
      cover_image: undefined,
      category: null,
      subcategory: null,
      email: undefined,
      owner: undefined,
      employee_count: null,
      insta_url: undefined,
      facebook_url: undefined,
      website_url: undefined,
      address: {
        address_line1: undefined,
        address_line2: undefined,
        street: undefined,
        landmark: undefined,
        sub_district: undefined,
        city: undefined,
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
    },
  });

  const selectedCategory = form.watch("category");

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
        business_type: vyapari.business_type || "Retail",
        category: vyapari.category || null,
        subcategory: vyapari.subcategory || null,
        email: vyapari.email || undefined,
        phone: vyapari.phone || "",
        owner: vyapari.owner || undefined,
        employee_count: vyapari.employee_count || null,
        insta_url: vyapari.insta_url || undefined,
        facebook_url: vyapari.facebook_url || undefined,
        website_url: vyapari.website_url || undefined,
        address: {
          address_line1: vyapari.address?.address_line1 || undefined,
          address_line2: vyapari.address?.address_line2 || undefined,
          street: vyapari.address?.street || undefined,
          landmark: vyapari.address?.landmark || undefined,
          sub_district: vyapari.address?.sub_district || undefined,
          city: vyapari.address?.city || undefined,
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
      });
    } else {
      form.reset();
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

  const onSubmit = async (values: VyapariFormValues) => {
    try {
      setSubmitting(true);

      const cleanData: any = {
        name: values.name,
        business_type: values.business_type,
        phone: values.phone,
        short_description: values.short_description || null,
        long_description: values.long_description || null,
        logo: values.logo || null,
        cover_image: values.cover_image || null,
        category: values.category || null,
        subcategory: values.subcategory || null,
        email: values.email && values.email.trim() !== "" ? values.email : null,
        owner: values.owner || null,
        employee_count: values.employee_count || null,
        insta_url: values.insta_url || null,
        facebook_url: values.facebook_url || null,
        website_url: values.website_url || null,
        is_verified: values.is_verified ?? false,
        is_blocked: values.is_blocked ?? false,
      };

      if (
        values.address &&
        Object.values(values.address).some((val) => val && val.trim() !== "")
      ) {
        cleanData.address = {};
        Object.keys(values.address).forEach((key) => {
          const value = values.address![key as keyof typeof values.address];
          cleanData.address[key] = value && value.trim() !== "" ? value : null;
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
        await axios.post("/vyapari/vyapari/", cleanData);
        toast.success("Business created successfully");
      } else {
        await axios.put(`/vyapari/vyapari/${vyapari?.id}/`, cleanData);
        toast.success("Business updated successfully");
      }

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
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
                  name="business_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BUSINESS_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="business@example.com"
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
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/logo.png"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
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

                <FormField
                  control={form.control}
                  name="cover_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/cover.jpg"
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
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

                <FormField
                  control={form.control}
                  name="employee_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee Count</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of employees"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address.address_line1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
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
                  name="address.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City name"
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
                      <FormLabel>District</FormLabel>
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
                      <FormLabel>State</FormLabel>
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

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Location Coordinates (Optional)
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="location.latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="e.g., 28.6139"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                        />
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
                        <Input
                          type="number"
                          step="any"
                          placeholder="e.g., 77.2090"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
