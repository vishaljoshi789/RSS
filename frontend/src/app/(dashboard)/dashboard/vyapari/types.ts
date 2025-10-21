// API Response Types
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

export interface Address {
  address_line1?: string;
  address_line2?: string;
  street?: string;
  landmark?: string;
  sub_district?: string;
  market?: string;
  district?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface Location {
  latitude?: number;
  longitude?: number;
}

export interface Vyapari {
  id: number;
  name: string;
  short_description: string | null;
  long_description: string | null;
  logo: string | null;
  cover_image: string | null;
  business_type: string;
  category: number | null;
  subcategory: number | null;
  email: string | null;
  phone: string;
  owner: string | null;
  employee_count: number | null;
  referred_by: string | null;
  insta_url: string | null;
  facebook_url: string | null;
  website_url: string | null;
  address: Address;
  location: Location;
  is_verified: boolean;
  is_blocked: boolean;
  is_business_account: boolean;
  date_joined: string;
}

// Form Data Types (for create/update)
export interface CategoryFormData {
  name: string;
  image?: File | null;
  description?: string;
}

export interface SubCategoryFormData {
  category: number;
  name: string;
  image?: File | null;
  description?: string;
}

export interface VyapariFormData {
  name: string;
  short_description?: string;
  long_description?: string;
  logo?: string;
  cover_image?: string;
  business_type: string;
  category?: number | null;
  subcategory?: number | null;
  email?: string;
  phone: string;
  owner?: string;
  employee_count?: number | null;
  insta_url?: string;
  facebook_url?: string;
  website_url?: string;
  address?: Address;
  location?: Location;
  is_verified?: boolean;
  is_blocked?: boolean;
  is_business_account?: boolean;
}

export interface CategoryWithCount extends Category {
  subcategories_count?: number;
  vyaparis_count?: number;
}

export interface SubCategoryWithDetails extends SubCategory {
  category_name?: string;
  vyaparis_count?: number;
}

export interface VyapariWithDetails extends Vyapari {
  category_name?: string;
  subcategory_name?: string;
}
