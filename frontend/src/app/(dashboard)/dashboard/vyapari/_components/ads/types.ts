export interface Vyapari {
  id: number;
  name: string;
}

export interface Advertisement {
  id: number;
  vyapari: number;
  vyapari_name?: string;
  ad_type: string;
  title: string;
  description: string;
  image: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface AdFormData {
  vyapari: string;
  ad_type: string;
  title: string;
  description: string;
  image: File | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export const AD_TYPES = [
  { value: "global", label: "Global" },
  { value: "district", label: "District" },
  { value: "market", label: "Market" },
  { value: "state", label: "State" },
  { value: "category", label: "Category" },
  { value: "subcategory", label: "SubCategory" },
];
