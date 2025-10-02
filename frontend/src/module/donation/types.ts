
export interface DonationFormData {
  name: string;
  email: string;
  phone: string;
  amount: number;
  payment_for: string;
  notes?: string;
}


export type PaymentStep = 'idle' | 'creating-order' | 'waiting-payment' | 'verifying' | 'completed';


export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  razorpayKey?: string;
  error?: string;
  message?: string;
}

export interface VerifyPaymentData {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  donationDetails: DonationFormData;
}

export interface PaymentVerificationResponse {
  success: boolean;
  paymentVerified?: boolean;
  message?: string;
  error?: string;
  payment_id?: string;
  order_id?: string;
  status?: string;
}


export interface DonationRecord {
  id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  currency: string;
  donationType: string;
  anonymous: boolean;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  completedAt?: string;
  receiptGenerated: boolean;
  taxExemption: boolean;
  message?: string;
  address?: string;
  panCard?: string;
}


export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: PaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface PaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}


export interface DonationPaymentState {
  isProcessing: boolean;
  error: string | null;
  success: boolean;
  donationId: string | null;
  receiptUrl: string | null;
}

export interface DonationHistoryState {
  donations: DonationRecord[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

export interface DonationFormState {
  step: 'form' | 'payment' | 'success' | 'error';
  formData: Partial<DonationFormData>;
  validationErrors: Record<string, string>;
}

export interface RazorpayState {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}


export interface DonationAmountOption {
  value: number;
  label: string;
  description: string;
}

export interface DonationTypeOption {
  value: string;
  label: string;
  description: string;
}


export interface DonationStats {
  totalDonations: number;
  donationCount: number;
  thisMonth: number;
  thisMonthCount: number;
  averageDonation: number;
  topDonationType: string;
  recentDonations: RecentDonation[];
}

export interface RecentDonation {
  id: string;
  amount: number;
  donor: string;
  type: string;
  date: string;
}


export interface RefundRequest {
  donationId: string;
  reason: string;
  requestedBy?: string;
  requestedAt?: string;
}

export interface RefundResponse {
  success: boolean;
  message?: string;
  refundId?: string;
  error?: string;
}


export interface ReceiptData {
  donationId: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  donationType: string;
  paymentDate: string;
  receiptNumber: string;
  organizationName: string;
  organizationAddress: string;
  organizationPan?: string;
  taxExemptionEligible: boolean;
}

export interface ReceiptDownloadResponse {
  success: boolean;
  receiptUrl?: string;
  message?: string;
  error?: string;
}


export interface LocalDonation {
  id: string;
  name: string;
  amount: number;
  paymentId: string;
  orderId: string;
  timestamp: string;
  status: string;
  type: string;
}


export interface DonationError {
  code: string;
  message: string;
  field?: string;
  timestamp: string;
}


export interface DonationConfig {
  minAmount: number;
  maxAmount: number;
  currency: string;
  razorpayKey: string;
  organizationName: string;
  organizationLogo: string;
  themeColor: string;
  supportEmail: string;
  supportPhone: string;
}


export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}


export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface AmountValidation {
  isValid: boolean;
  amount: number;
  error?: string;
}


export type {
 
  DonationFormData as FormData,
  DonationRecord as Record,
  PaymentResponse as RazorpayResponse,
  DonationStats as Stats,
};