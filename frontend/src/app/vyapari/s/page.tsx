"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, MapPin, Building2, Tag, X } from "lucide-react";
import useAxios from "@/hooks/use-axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import stateDistrictData from "@/lib/state-district.json";

interface Category {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
}

interface SubCategory {
  id: number;
  category: number;
  name: string;
  image: string | null;
  description: string | null;
}

interface Vyapari {
  id: number;
  name: string;
  short_description: string | null;
  logo: string | null;
  business_type: string;
  category: number | null;
  subcategory: number | null;
  phone: string;
  address: {
    city?: string;
    state?: string;
    district?: string;
    country?: string;
  };
}

const VyapariSearchPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const axios = useAxios();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

  const [vyaparis, setVyaparis] = useState<Vyapari[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    SubCategory[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const indiaData = stateDistrictData.India;
  const allStates = Object.keys(indiaData);

  const getDistrictsForState = (stateName: string) => {
    if (!stateName || stateName === "all") return [];
    const stateData = indiaData[stateName as keyof typeof indiaData];
    return stateData ? Object.keys(stateData.districts) : [];
  };

  const getCitiesForDistrict = (stateName: string, districtName: string) => {
    if (
      !stateName ||
      stateName === "all" ||
      !districtName ||
      districtName === "all"
    )
      return [];
    const stateData = indiaData[stateName as keyof typeof indiaData];
    if (!stateData) return [];
    const cities =
      stateData.districts[districtName as keyof typeof stateData.districts];
    return cities || [];
  };

  const availableDistricts = getDistrictsForState(selectedState);
  const availableCities = getCitiesForDistrict(selectedState, selectedDistrict);

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          axios.get("/vyapari/category/"),
          axios.get("/vyapari/subcategory/"),
        ]);
        setCategories(categoriesRes.data.results || categoriesRes.data || []);
        setSubcategories(
          subcategoriesRes.data.results || subcategoriesRes.data || []
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      const filtered = subcategories.filter(
        (sub) => sub.category === Number(selectedCategory)
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (selectedTags && selectedTags !== "all") {
        params.append("tags", selectedTags);
      } else {
        params.append("tags", "");
      }

      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      } else {
        params.append("category", "");
      }

      if (selectedSubcategory && selectedSubcategory !== "all") {
        params.append("subcategory", selectedSubcategory);
      } else {
        params.append("subcategory", "");
      }

      if (selectedCity && selectedCity !== "all") {
        params.append("city", selectedCity);
      } else {
        params.append("city", "");
      }

      if (selectedState && selectedState !== "all") {
        params.append("state", selectedState);
      } else {
        params.append("state", "");
      }

      if (selectedDistrict && selectedDistrict !== "all") {
        params.append("district", selectedDistrict);
      } else {
        params.append("district", "");
      }

      const response = await axios.get(
        `/vyapari/vyapari/?${params.toString()}`
      );
      const results = response.data.results || response.data || [];
      setVyaparis(results);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags("all");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedCity("all");
    setSelectedState("all");
    setSelectedDistrict("all");
  };

  const hasActiveFilters =
    (selectedTags && selectedTags !== "all") ||
    (selectedCategory && selectedCategory !== "all") ||
    (selectedSubcategory && selectedSubcategory !== "all") ||
    (selectedCity && selectedCity !== "all") ||
    (selectedState && selectedState !== "all") ||
    (selectedDistrict && selectedDistrict !== "all");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Search Bar */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for businesses, products, or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-12 pl-10 text-base"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="h-12 px-8"
            >
              <Search className="mr-2 h-5 w-5" />
              {loading ? "Searching..." : "Search"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6 lg:hidden"
            >
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-20 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 text-xs"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Tags
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter tags..."
                    value={selectedTags === "all" ? "" : selectedTags}
                    onChange={(e) => setSelectedTags(e.target.value || "all")}
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
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
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Subcategory
                  </label>
                  <Select
                    value={selectedSubcategory}
                    onValueChange={setSelectedSubcategory}
                    disabled={
                      !selectedCategory || filteredSubcategories.length === 0
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Subcategories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
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
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    State
                  </label>
                  <Select
                    value={selectedState}
                    onValueChange={(value) => {
                      setSelectedState(value);
                      setSelectedDistrict("all");
                      setSelectedCity("all");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {allStates.map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    District
                  </label>
                  <Select
                    value={selectedDistrict}
                    onValueChange={(value) => {
                      setSelectedDistrict(value);
                      setSelectedCity("all");
                    }}
                    disabled={!selectedState || selectedState === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {availableDistricts.map((district: string) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    City
                  </label>
                  <Select
                    value={selectedCity}
                    onValueChange={setSelectedCity}
                    disabled={
                      !selectedState ||
                      selectedState === "all" ||
                      !selectedDistrict ||
                      selectedDistrict === "all"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {availableCities.map((city: string) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSearch} disabled={loading} className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </aside>

          {showFilters && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden">
              <div className="fixed inset-y-0 left-0 w-full max-w-sm border-r bg-background p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 text-xs"
                      >
                        <X className="mr-1 h-3 w-3" />
                        Clear
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Tags
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter tags..."
                      value={selectedTags === "all" ? "" : selectedTags}
                      onChange={(e) => setSelectedTags(e.target.value || "all")}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Category
                    </label>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
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
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Subcategory
                    </label>
                    <Select
                      value={selectedSubcategory}
                      onValueChange={setSelectedSubcategory}
                      disabled={
                        !selectedCategory || filteredSubcategories.length === 0
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Subcategories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subcategories</SelectItem>
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
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      State
                    </label>
                    <Select
                      value={selectedState}
                      onValueChange={(value) => {
                        setSelectedState(value);
                        setSelectedDistrict("all");
                        setSelectedCity("all");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {allStates.map((state: string) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      District
                    </label>
                    <Select
                      value={selectedDistrict}
                      onValueChange={(value) => {
                        setSelectedDistrict(value);
                        setSelectedCity("all");
                      }}
                      disabled={!selectedState || selectedState === "all"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {availableDistricts.map((district: string) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      City
                    </label>
                    <Select
                      value={selectedCity}
                      onValueChange={setSelectedCity}
                      disabled={
                        !selectedState ||
                        selectedState === "all" ||
                        !selectedDistrict ||
                        selectedDistrict === "all"
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cities</SelectItem>
                        {availableCities.map((city: string) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={() => {
                      handleSearch();
                      setShowFilters(false);
                    }} 
                    disabled={loading} 
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="flex-1 min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Search Results</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {loading ? "Searching..." : `${vyaparis.length} businesses found`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48 animate-pulse bg-muted" />
                    <CardContent className="p-4">
                      <div className="h-4 animate-pulse rounded bg-muted" />
                      <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-muted" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : vyaparis.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No businesses found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try adjusting your search filters
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {vyaparis.map((vyapari) => (
                  <Link key={vyapari.id} href={`/vyapari/${vyapari.id}`}>
                    <Card className="group overflow-hidden transition-all hover:shadow-lg">
                      <div className="relative h-48 overflo1w-hidden bg-muted">
                        {vyapari.logo ? (
                          <Image
                            src={vyapari.logo}
                            alt={vyapari.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Building2 className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1">
                          {vyapari.name}
                        </h3>
                        {vyapari.short_description && (
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {vyapari.short_description}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          {vyapari.address?.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {vyapari.address.city}
                            </span>
                          )}
                          {vyapari.business_type && (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                              {vyapari.business_type}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VyapariSearchPage;
