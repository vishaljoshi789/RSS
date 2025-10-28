export interface User {
  id: number;
  email: string;
  phone: string;
  name: string;
  dob: string;
  user_id: string;
  gender: string;
  profession: string;
  image: string | null;
  aadhar_number: string;
  pan_number: string;
  street: string;
  sub_district: string;
  district: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_verified: boolean;
  is_blocked: boolean;
  is_volunteer: boolean;
  is_admin_account: boolean;
  is_business_account: boolean;
  is_staff_account: boolean;
  is_member_account: boolean;
  is_field_worker: boolean;
  referred_by: number | null;
  referral_count?: number;
}

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}
