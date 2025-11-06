"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import useAxios from "@/hooks/use-axios";
import { Ads } from "../_components/search";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

interface Vyapari {
  id: number;
  name: string;
  short_description: string | null;
  logo: string | null;
  phone: string;
  address:
    | string
    | {
        city?: string;
        state?: string;
        district?: string;
        market?: string;
        country?: string;
      };
  is_verified: boolean;
}

interface Category {
  id: number;
  name: string;
}

const BusinessesPageContent = () => {
  const router = useRouter();
  const axios = useAxios();
  const searchParams = useSearchParams();

  const [businesses, setBusinesses] = useState<Vyapari[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");

  // Indian states list
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  useEffect(() => {
    fetchCategories();
    fetchBusinesses();
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [searchQuery, selectedCategory, selectedState]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/vyapari/category/");
      setCategories(response.data.results || response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (selectedState && selectedState !== "all") {
        params.append("state", selectedState);
      }

      const response = await axios.get(
        `/vyapari/vyapari/?${params.toString()}`
      );
      setBusinesses(response.data.results || response.data || []);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBusinesses();
  };

  const getLocation = (business: Vyapari) => {
    if (!business.address) return "India";

    const addr =
      typeof business.address === "string"
        ? JSON.parse(business.address)
        : business.address;

    const parts = [addr.city || addr.market, addr.district, addr.state].filter(
      Boolean
    );

    return parts.length > 0 ? parts.join(", ") : "India";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ads Section */}

      {/* Header */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                All Businesses
              </h1>
              <p className="text-muted-foreground">
                Discover and connect with businesses across India
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="flex flex-wrap gap-3">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {indianStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(selectedCategory !== "all" || selectedState !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedState("all");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Ads />
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {businesses.length === 0
                  ? "No businesses found"
                  : `Showing ${businesses.length} ${
                      businesses.length === 1 ? "business" : "businesses"
                    }`}
              </p>
            </div>

            {businesses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No businesses found
                  </h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedState("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {businesses.map((business) => (
                  <Card
                    key={business.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/vyapari/${business.id}`)}
                  >
                    <CardContent className="p-0">
                      {/* Logo */}
                      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5">
                        {business.logo ? (
                          <Image
                            src={business.logo}
                            alt={business.name}
                            fill
                            className="object-cover"
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Building2 className="h-16 w-16 text-primary/40" />
                          </div>
                        )}
                        {business.is_verified && (
                          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Verified
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                          {business.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {business.short_description || "No description"}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            📍 {getLocation(business)}
                          </span>
                          <span className="text-primary font-medium">
                            View Details →
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default function BusinessesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <BusinessesPageContent />
    </Suspense>
  );
}
