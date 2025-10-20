export interface Category {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
}

export interface SubCategory {
  id: number;
  category: number;
  name: string;
  image: string | null;
  description: string | null;
}

export interface Vyapari {
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

export interface FilterState {
  searchQuery: string;
  selectedTags: string;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedCity: string;
  selectedState: string;
  selectedDistrict: string;
}
