export interface Wing {
  id: number;
  name: string;
  description: string;
}

export interface Level {
  id: number;
  name: string;
  wing: number; 
  wing_details?: Wing; 
}

export interface Designation {
  id: number;
  title: string;
  level: number; 
  total_positions: number;
  level_details?: Level; 
}

export interface Volunteer {
  id: number;
  user: number; 
  phone_number: string;
  wing: number | null;
  level: number | null;
  designation: number | null;
  joined_date: string;
  
  user_details?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  wing_details?: Wing;
  level_details?: Level;
  designation_details?: Designation;
}

export interface VolunteerWithUser {
  id: number;
  user: import('@/types/auth.types').User;
  wing_name: string;
  level_name: string;
  designation_title: string;
  phone_number: string;
  affidavit: string | null;
  joined_date: string;
  aadhar_card_front: string | null;
  aadhar_card_back: string | null;
  image: string | null;
  can_view_member_data: boolean;
  wing: number | null;
  level: number | null;
  designation: number | null;
  working_areas: Array<string>;
}


export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}


export interface WingFormData {
  name: string;
  description: string;
}

export interface LevelFormData {
  name: string[];
  wing: number;
}

export interface DesignationFormData {
  title: string;
  level: number;
  total_positions: number;
}

export interface VolunteerFormData {
  user: number;
  designation: number;
  phone_number: string;
}


export interface VolunteerFilters {
  wing?: number;
  level?: number;
  designation?: number;
  search?: string;
}

export interface Application {
  id: number;
  user: number;
  user_name: string;
  timestamp: string;
  wing: number | null;
  wing_name: string | null;
  level: number | null;
  level_name: string | null;
  designation: number | null;
  designation_title: string | null;
  phone_number: string | null;
  affidavit: string | null;
  aadhar_card_front: string | null;
  aadhar_card_back: string | null;
  image: string | null;
  status: string;
  remarks: string | null;
}

export interface ApplicationFormData {
  user?: number;
  wing: number | null;
  level: number | null;
  level_name?: string | null;
  designation: number | null;
  phone_number: string | null;
  referred_by_volunteer?: string | null;
  aadhar_card_front?: File | null;
  aadhar_card_back?: File | null;
  image?: File | null;
}

export interface AddressFormData {
  street?: string;
  sub_district?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  mandal?: string;
  hindi_name?: string;
}

export interface ApplicationFilters {
  status?: string;
  wing?: number;
  level?: number;
  designation?: number;
  search?: string;
}

export * from './user';
