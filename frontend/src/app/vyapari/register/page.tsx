"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  FileText,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import type { Category, SubCategory } from "../types";

interface FormData {
  // Basic Information
  name: string;
  business_type: string;
  category: string;
  subcategory: string;
  owner: string;
  employee_count: string;
  short_description: string;
  long_description: string;

  // Contact Information
  phone: string;
  email: string;
  website_url: string;
  insta_url: string;
  facebook_url: string;

  // Address
  address_line1: string;
  address_line2: string;
  street: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  postal_code: string;
  country: string;

  // Location
  latitude: string;
  longitude: string;

  // Images
  logo: string;
  cover_image: string;
}

export default function RegisterBusinessPage() {
  const router = useRouter();
  const axios = useAxios();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<SubCategory[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    business_type: "none",
    category: "none",
    subcategory: "none",
    owner: "",
    employee_count: "",
    short_description: "",
    long_description: "",
    phone: "",
    email: "",
    website_url: "",
    insta_url: "",
    facebook_url: "",
    address_line1: "",
    address_line2: "",
    street: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    postal_code: "",
    country: "India",
    latitude: "",
    longitude: "",
    logo: "",
    cover_image: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

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
      setSubcategories(subcategoriesRes.data.results || subcategoriesRes.data || []);
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
        if (formData.business_type === "none") {
          toast.error("Please select a business type");
          return false;
        }
        if (formData.category === "none") {
          toast.error("Please select a category");
          return false;
        }
        break;
      case 2:
        if (!formData.address_line1.trim() || !formData.city.trim() || !formData.state.trim()) {
          toast.error("Address, city, and state are required");
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

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    try {
      setLoading(true);

      const submitFormData = new FormData();

      // Basic fields
      submitFormData.append("name", formData.name);
      submitFormData.append("business_type", formData.business_type);
      submitFormData.append("phone", formData.phone);

      // Optional fields
      if (formData.category !== "none") {
        submitFormData.append("category", formData.category);
      }
      if (formData.subcategory !== "none") {
        submitFormData.append("subcategory", formData.subcategory);
      }
      if (formData.owner) submitFormData.append("owner", formData.owner);
      if (formData.employee_count) submitFormData.append("employee_count", formData.employee_count);
      if (formData.short_description) submitFormData.append("short_description", formData.short_description);
      if (formData.long_description) submitFormData.append("long_description", formData.long_description);
      if (formData.email) submitFormData.append("email", formData.email);
      if (formData.website_url) submitFormData.append("website_url", formData.website_url);
      if (formData.insta_url) submitFormData.append("insta_url", formData.insta_url);
      if (formData.facebook_url) submitFormData.append("facebook_url", formData.facebook_url);

      // Address (JSON field)
      const address = {
        address_line1: formData.address_line1,
        address_line2: formData.address_line2,
        street: formData.street,
        landmark: formData.landmark,
        city: formData.city,
        district: formData.district,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
      };
      submitFormData.append("address", JSON.stringify(address));

      // Location (JSON field)
      const location: any = {};
      if (formData.latitude) location.latitude = parseFloat(formData.latitude);
      if (formData.longitude) location.longitude = parseFloat(formData.longitude);
      submitFormData.append("location", JSON.stringify(location));

      // Images
      if (formData.logo) {
        submitFormData.append("logo", formData.logo);
      }
      if (formData.cover_image) {
        submitFormData.append("cover_image", formData.cover_image);
      }

      await axios.post("/vyapari/vyapari/", submitFormData);

      toast.success("Business registered successfully! Pending admin approval.");
      
      // Redirect after success
      setTimeout(() => {
        router.push("/vyapari");
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Failed to register business");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/vyapari")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Register Your Business</h1>
              <p className="text-muted-foreground">
                Join our business directory and reach more customers
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    step >= s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle className="h-5 w-5" /> : s}
                </div>
                <span className={`text-sm font-medium ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? "Basic Info" : s === 2 ? "Contact & Address" : "Images & Review"}
                </span>
                {s < 3 && <div className="h-0.5 w-12 bg-muted-foreground/30" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form Steps */}
        <Card className="border-2">
          <CardContent className="p-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Basic Information
                  </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Business Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner Name</Label>
                    <Input
                      id="owner"
                      name="owner"
                      value={formData.owner}
                      onChange={handleInputChange}
                      placeholder="Enter owner name"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="business_type">
                      Business Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.business_type}
                      onValueChange={(value) => handleSelectChange("business_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select Type</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Wholesale">Wholesale</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee_count">Number of Employees</Label>
                    <Input
                      id="employee_count"
                      name="employee_count"
                      type="number"
                      value={formData.employee_count}
                      onChange={handleInputChange}
                      placeholder="e.g., 10"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Select Category</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) => handleSelectChange("subcategory", value)}
                      disabled={filteredSubcategories.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {filteredSubcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id.toString()}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    placeholder="Brief description of your business (1-2 lines)"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="long_description">Detailed Description</Label>
                  <Textarea
                    id="long_description"
                    name="long_description"
                    value={formData.long_description}
                    onChange={handleInputChange}
                    placeholder="Detailed description of your business, products, and services"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 1234567890"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact & Address */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Contact & Address Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Contact Details</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website_url">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="website_url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        placeholder="https://www.yourbusiness.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="insta_url">Instagram</Label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="insta_url"
                          name="insta_url"
                          value={formData.insta_url}
                          onChange={handleInputChange}
                          placeholder="https://instagram.com/..."
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebook_url">Facebook</Label>
                      <div className="relative">
                        <Facebook className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="facebook_url"
                          name="facebook_url"
                          value={formData.facebook_url}
                          onChange={handleInputChange}
                          placeholder="https://facebook.com/..."
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground">Address</h3>

                  <div className="space-y-2">
                    <Label htmlFor="address_line1">
                      Address Line 1 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address_line1"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      placeholder="House/Flat no., Building name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line2">Address Line 2</Label>
                    <Input
                      id="address_line2"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleInputChange}
                      placeholder="Area, Colony"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street</Label>
                      <Input
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="Street name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="Near..."
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="District"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="state">
                        State <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={handleInputChange}
                        placeholder="123456"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude (Optional)</Label>
                      <Input
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        placeholder="e.g., 28.7041"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude (Optional)</Label>
                      <Input
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        placeholder="e.g., 77.1025"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Images & Review */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    Business Images
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Business Logo URL</Label>
                    <Input
                      id="logo"
                      name="logo"
                      type="url"
                      placeholder="https://example.com/logo.jpg"
                      value={formData.logo}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the URL of your business logo (Square format recommended)
                    </p>
                    {formData.logo && (
                      <div className="border-2 border-dashed rounded-lg p-4">
                        <img
                          src={formData.logo}
                          alt="Logo preview"
                          className="mx-auto h-32 w-32 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover_image">Cover Image URL</Label>
                    <Input
                      id="cover_image"
                      name="cover_image"
                      type="url"
                      placeholder="https://example.com/cover.jpg"
                      value={formData.cover_image}
                      onChange={handleInputChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter the URL of your cover image (16:9 format recommended)
                    </p>
                    {formData.cover_image && (
                      <div className="border-2 border-dashed rounded-lg p-4">
                        <img
                          src={formData.cover_image}
                          alt="Cover preview"
                          className="mx-auto h-48 w-full rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your business will be reviewed by our team before appearing in the directory.
                    You will be notified once it's approved.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1 || loading}
              >
                Back
              </Button>

              <div className="flex gap-2">
                {step < 3 ? (
                  <Button onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Submitting..." : "Submit for Review"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
