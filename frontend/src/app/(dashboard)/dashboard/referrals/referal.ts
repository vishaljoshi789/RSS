export interface User {
  id?: number;
  user_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  is_verified?: boolean;
  is_member_account?: boolean;
  is_admin_account?: boolean;
  is_staff_account?: boolean;
  is_volunteer?: boolean;
  is_business_account?: boolean;
  date_joined?: string;
  gender?: string;
  profession?: string;
  dob?: string;
  referred_by?: string | null;
  referral_count?: number;
  district?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  sub_district?: string;
  street?: string;
  country?: string;
  aadhar_number?: string;
  pan_number?: string;
  is_blocked?: boolean;
  last_login?: string | null;
}

export interface ReferralItem {
  id?: number | string;
  user_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  is_verified?: boolean;
  is_member_account?: boolean;
  date_joined?: string;
  gender?: string;
  profession?: string;
  referral_count?: number;
}

export interface ShowReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onUserClick: (userId: string) => void;
}

export interface ReferralUser {
  id?: number;
  user_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  is_verified?: boolean;
  is_member_account?: boolean;
  date_joined?: string;
  referral_count?: number;
}

export interface ShowReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  onUserClick: (userId: string) => void;
}

export interface SearchBarProps {
  userId: string;
  loading: boolean;
  onUserIdChange: (value: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface UserProfileCardProps {
  userData: User | null;
  loading: boolean;
  referralsCount: number;
}


export interface ReferralsTableProps {
  referrals: ReferralItem[];
  loading: boolean;
  error: string | null;
  onReferralClick: (userId: string, userName: string) => void;
}
