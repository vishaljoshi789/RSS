"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  AlertCircle,
  Layers,
  Instagram,
  Facebook,
  Users,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import type { Category, SubCategory, Vyapari } from "../../types";
import { buildMediaUrl } from "@/lib/media";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const axios = useAxios();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [vyaparis, setVyaparis] = useState<Vyapari[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  const getImageUrl = (imagePath: string | null | undefined) => {
    return buildMediaUrl(imagePath) ?? null;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoryRes, subcategoriesRes, vyaparisRes] = await Promise.all([
        axios.get(`/vyapari/category/${categoryId}/`),
        axios.get("/vyapari/subcategory/"),
        axios.get("/vyapari/vyapari/"),
      ]);

      setCategory(categoryRes.data);

      const filteredSubs = (
        subcategoriesRes.data.results ||
        subcategoriesRes.data ||
        []
      ).filter((sub: SubCategory) => sub.category === parseInt(categoryId));
      setSubcategories(filteredSubs);

      const filteredVyaparis = (
        vyaparisRes.data.results ||
        vyaparisRes.data ||
        []
      ).filter((v: Vyapari) => v.category === parseInt(categoryId));
      setVyaparis(filteredVyaparis);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to load category data");
      toast.error("Failed to load category");
    } finally {
      setLoading(false);
    }
  };

  // Get subcategory name
  const getSubcategoryName = (subcategoryId: number | null) => {
    if (!subcategoryId) return "General";
    const sub = subcategories.find((s) => s.id === subcategoryId);
    return sub?.name || "Unknown";
  };

  // Filter vyaparis
  const filteredVyaparis = vyaparis.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phone.includes(searchTerm) ||
      (v.email && v.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubcategory =
      selectedSubcategory === "all" ||
      (selectedSubcategory === "none" && !v.subcategory) ||
      v.subcategory?.toString() === selectedSubcategory;

    const matchesVerification =
      verificationFilter === "all" ||
      (verificationFilter === "verified" && v.is_verified) ||
      (verificationFilter === "unverified" && !v.is_verified);

    return (
      matchesSearch &&
      matchesSubcategory &&
      matchesVerification &&
      !v.is_blocked
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-48 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Category not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/vyapari")}
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="mb-8 overflow-hidden border-2 shadow-lg">
          <div className="relative">
            <CardContent className="relative">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                {/* Category Image */}
                {getImageUrl(category.image) ? (
                  <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-2xl border-4 border-background shadow-xl">
                    <Image
                      src={getImageUrl(category.image)!}
                      alt={category.name}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                    />
                  </div>
                ) : (
                  <div className="flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 shadow-xl">
                    <Layers className="h-20 w-20 text-primary" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                    <Building2 className="h-4 w-4" />
                    <span>Business Category</span>
                  </div>

                  <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    {category.name}
                  </h1>

                  {category.description && (
                    <p className="mt-3 text-lg text-muted-foreground max-w-3xl">
                      {category.description}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Badge variant="secondary" className="px-4 py-2 text-sm">
                      <Building2 className="mr-2 h-4 w-4" />
                      {filteredVyaparis.length}{" "}
                      {filteredVyaparis.length === 1
                        ? "Business"
                        : "Businesses"}
                    </Badge>
                    {subcategories.length > 0 && (
                      <Badge variant="outline" className="px-4 py-2 text-sm">
                        <Layers className="mr-2 h-4 w-4" />
                        {subcategories.length}{" "}
                        {subcategories.length === 1
                          ? "Subcategory"
                          : "Subcategories"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        <Card className="border shadow-md">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Filter & Search</h2>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {subcategories.length > 0 && (
                <Select
                  value={selectedSubcategory}
                  onValueChange={setSelectedSubcategory}
                >
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Subcategories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subcategories</SelectItem>
                    <SelectItem value="none">General</SelectItem>
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id.toString()}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select
                value={verificationFilter}
                onValueChange={setVerificationFilter}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Businesses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Businesses</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-6 mb-6 ">
          {(searchTerm ||
            selectedSubcategory !== "all" ||
            verificationFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedSubcategory("all");
                setVerificationFilter("all");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {filteredVyaparis.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="py-16 text-center">
              <Building2 className="mx-auto h-16 w-16 text-muted-foreground opacity-20" />
              <h3 className="mt-4 text-lg font-semibold">
                No Businesses Found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm ||
                selectedSubcategory !== "all" ||
                verificationFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No businesses in this category yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVyaparis.map((vyapari) => (
              <Card
                key={vyapari.id}
                className="group overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
              >
                {/* Cover Image with Padding */}
                {getImageUrl(vyapari.cover_image) ? (
                  <div className="p-4 pb-0">
                    <div className="relative h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                      <Image
                        src={getImageUrl(vyapari.cover_image)!}
                        alt={vyapari.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 pb-0">
                    <div className="relative h-40 w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 className="h-16 w-16 text-primary/20" />
                      </div>
                    </div>
                  </div>
                )}

                <CardContent className="p-6">
                  {/* Business Header */}
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 border-4 border-background shadow-md ring-2 ring-primary/10">
                      <AvatarImage
                        src={getImageUrl(vyapari.logo) || undefined}
                        alt={vyapari.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-bold">
                        {vyapari.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                          {vyapari.name}
                        </h3>
                        {vyapari.is_verified && (
                          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="text-xs">
                          {vyapari.business_type}
                        </Badge>
                        {vyapari.subcategory && (
                          <Badge variant="outline" className="text-xs">
                            {getSubcategoryName(vyapari.subcategory)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {vyapari.short_description && (
                    <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
                      {vyapari.short_description}
                    </p>
                  )}

                  {/* Contact Info */}
                  <div className="mt-5 space-y-2.5">
                    <div className="flex items-center gap-2.5 text-sm">
                      <Phone className="h-4 w-4 text-primary" />
                      <a
                        href={`tel:${vyapari.phone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {vyapari.phone}
                      </a>
                    </div>
                    {vyapari.email && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <Mail className="h-4 w-4 text-primary" />
                        <a
                          href={`mailto:${vyapari.email}`}
                          className="truncate hover:text-primary transition-colors"
                        >
                          {vyapari.email}
                        </a>
                      </div>
                    )}
                    {vyapari.address?.city && (
                      <div className="flex items-center gap-2.5 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="truncate">
                          {vyapari.address.city}
                          {vyapari.address.state &&
                            `, ${vyapari.address.state}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Social Links & Actions */}
                  <div className="mt-5 flex items-center justify-between gap-2 border-t pt-5">
                    <div className="flex gap-1.5">
                      {vyapari.website_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                          onClick={() =>
                            window.open(vyapari.website_url!, "_blank")
                          }
                          title="Visit Website"
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                      {vyapari.insta_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                          onClick={() =>
                            window.open(vyapari.insta_url!, "_blank")
                          }
                          title="Instagram"
                        >
                          <Instagram className="h-4 w-4" />
                        </Button>
                      )}
                      {vyapari.facebook_url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 hover:bg-primary/10 hover:text-primary"
                          onClick={() =>
                            window.open(vyapari.facebook_url!, "_blank")
                          }
                          title="Facebook"
                        >
                          <Facebook className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {vyapari.employee_count && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        <span>{vyapari.employee_count} employees</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
