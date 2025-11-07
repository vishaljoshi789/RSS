"use client";

import React, { useState, useEffect, useCallback } from "react";

import useAxios from "@/hooks/use-axios";
import stateDistrictData from "@/lib/state-district.json";
import {
  SearchBar,
  FilterSidebar,
  FilterOverlay,
  SearchResults,
  Ads,
  Category,
  SubCategory,
  Vyapari,
} from "../_components/search";

const VyapariSearchPage = () => {
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
  const [showFilters, setShowFilters] = useState(false);

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

  const fetchCategoriesAndSubcategories = useCallback(async () => {
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
  }, [axios]);

  useEffect(() => {
    fetchCategoriesAndSubcategories();
  }, [fetchCategoriesAndSubcategories]);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      // Find the category object by name
      const selectedCategoryObj = categories.find(
        (cat) => cat.name === selectedCategory
      );
      if (selectedCategoryObj) {
        const filtered = subcategories.filter(
          (sub) => sub.category === selectedCategoryObj.id
        );
        setFilteredSubcategories(filtered);
      } else {
        setFilteredSubcategories([]);
      }
    } else {
      setFilteredSubcategories([]);
    }
  }, [selectedCategory, subcategories, categories]);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      if (selectedTags && selectedTags !== "all") {
        params.append("tags", selectedTags);
      }

      if (selectedCategory && selectedCategory !== "all") {
        params.append("category", selectedCategory);
      }

      if (selectedSubcategory && selectedSubcategory !== "all") {
        params.append("subcategory", selectedSubcategory);
      }

      if (selectedCity && selectedCity !== "all") {
        params.append("city", selectedCity);
      }

      if (selectedState && selectedState !== "all") {
        params.append("state", selectedState);
      }

      if (selectedDistrict && selectedDistrict !== "all") {
        params.append("district", selectedDistrict);
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
  }, [
    axios,
    searchQuery,
    selectedTags,
    selectedCategory,
    selectedSubcategory,
    selectedCity,
    selectedState,
    selectedDistrict,
  ]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags("all");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSelectedCity("all");
    setSelectedState("all");
    setSelectedDistrict("all");
  };

  const hasActiveFilters = Boolean(
    (selectedTags && selectedTags !== "all") ||
      (selectedCategory && selectedCategory !== "all") ||
      (selectedSubcategory && selectedSubcategory !== "all") ||
      (selectedCity && selectedCity !== "all") ||
      (selectedState && selectedState !== "all") ||
      (selectedDistrict && selectedDistrict !== "all")
  );

  return (
    <div className="min-h-screen bg-background">

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        loading={loading}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Ads
            selectedCategory={selectedCategory}
            selectedState={selectedState}
            selectedDistrict={selectedDistrict}
            selectedMarket={selectedCity}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          <FilterSidebar
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            categories={categories}
            filteredSubcategories={filteredSubcategories}
            allStates={allStates}
            availableDistricts={availableDistricts}
            availableCities={availableCities}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onApplyFilters={handleSearch}
            loading={loading}
          />

          <FilterOverlay
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            categories={categories}
            filteredSubcategories={filteredSubcategories}
            allStates={allStates}
            availableDistricts={availableDistricts}
            availableCities={availableCities}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onApplyFilters={handleSearch}
            loading={loading}
          />

          <SearchResults vyaparis={vyaparis} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default VyapariSearchPage;
