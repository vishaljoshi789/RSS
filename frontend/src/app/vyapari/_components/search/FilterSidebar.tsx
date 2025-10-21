import React from "react";
import { MapPin, Building2, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, SubCategory } from "./types";

interface FilterSidebarProps {
  selectedTags: string;
  setSelectedTags: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (value: string) => void;
  selectedState: string;
  setSelectedState: (value: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  categories: Category[];
  filteredSubcategories: SubCategory[];
  allStates: string[];
  availableDistricts: string[];
  availableCities: string[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  loading: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedTags,
  setSelectedTags,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  selectedCity,
  setSelectedCity,
  categories,
  filteredSubcategories,
  allStates,
  availableDistricts,
  availableCities,
  hasActiveFilters,
  onClearFilters,
  onApplyFilters,
  loading,
}) => {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-20 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
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
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4 text-muted-foreground" />
              Subcategory
            </label>
            <Select
              value={selectedSubcategory}
              onValueChange={setSelectedSubcategory}
              disabled={!selectedCategory || filteredSubcategories.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Subcategories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {filteredSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.name}>
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
              Market
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
                <SelectValue placeholder="Select Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Market</SelectItem>
                {availableCities.map((city: string) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={onApplyFilters} disabled={loading} className="w-full">
            Apply Filters
          </Button>
        </div>
      </div>
    </aside>
  );
};
