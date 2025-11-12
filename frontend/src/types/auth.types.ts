
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  phone?: string;
  dob?: string;
  user_id: string;
  gender?: string;
  profession?: string;
  blood_group?: string;
  
 
  image?: string;
  
 
  aadhar_number?: string;
  pan_number?: string;
  
 
  street?: string;
  sub_district?: string;
  district?: string;
  city?: string;
  division?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  
 
  is_verified: boolean;
  is_blocked: boolean;
  is_volunteer: boolean;
  is_admin_account: boolean;
  is_business_account: boolean;
  is_staff_account: boolean;
  is_member_account: boolean;
  is_field_worker: boolean;
  
  // Referral
  referred_by?: string | null;
  
  // System fields
  is_staff: boolean;
  is_active: boolean;
  is_superuser?: boolean;
  date_joined: string;
  last_login?: string;
  
}


export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  phone: string;
  dob: string;
  password?: string;
  referred_by?: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  tokens?: AuthTokens;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (data: RegisterRequest) => Promise<LoginResponse>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  verifyToken: (token?: string) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  setUserData: (userData: User) => void;
  refreshUserData: () => Promise<boolean>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  isAdmin: () => boolean;
  isStaff: () => boolean;
  isVolunteer: () => boolean;
}
