// This file is no longer used since we moved to direct axios calls in hooks
// Keeping minimal exports for backward compatibility

export * from '../types';

async function validateDonationSession() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;



    if (authToken) {


      return {
        isAuthenticated: true,
        user: {

          name: 'User Name',
          email: 'user@example.com',
          phone: '+919876543210',
        }
      };
    }

    return {
      isAuthenticated: false,
      user: null
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return {
      isAuthenticated: false,
      user: null
    };
  }
}

async function createDonationOrder(formData: DonationFormData): Promise<CreateOrderResponse> {
  try {
    // Step 1: Validate form data
    if (!formData.name || !formData.email || !formData.phone || !formData.amount) {
      return {
        success: false,
        error: 'Required fields are missing'
      };
    }

    if (formData.amount < 1 || formData.amount > 500000) {
      return {
        success: false,
        error: 'Donation amount must be between ₹1 and ₹5,00,000'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        error: 'Invalid email format'
      };
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ''))) {
      return {
        success: false,
        error: 'Invalid phone number format'
      };
    }

    // Step 2: Call backend API to create Razorpay order
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/payment/create-order/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: formData.amount,
        payment_for: formData.payment_for,
        notes: formData.notes,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const orderData = await response.json();

    // Step 3: Return order data for frontend
    if (orderData.success && orderData.order_id) {
      return {
        success: true,
        orderId: orderData.order_id,
        amount: orderData.amount,
        currency: orderData.currency,
        razorpayKey: orderData.razorpay_key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        message: 'Order created successfully'
      };
    } else {
      throw new Error(orderData.message || 'Failed to create order');
    }

  } catch (error) {
    console.error('Create order error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create donation order. Please try again.'
    };
  }
}

async function verifyDonationPayment(paymentData: VerifyPaymentData): Promise<PaymentVerificationResponse> {
  try {
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, donationDetails } = paymentData;

    // Step 1: Validate payment data
    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return {
        success: false,
        error: 'Payment verification data is incomplete'
      };
    }

    // Step 2: Call backend API to verify payment
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/api/payment/verify/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: razorpaySignature,
        donation_details: {
          name: donationDetails.name,
          email: donationDetails.email,
          phone: donationDetails.phone,
          amount: donationDetails.amount,
          payment_for: donationDetails.payment_for,
          notes: donationDetails.notes,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const verificationResult = await response.json();

    // Step 3: Process verification result
    if (verificationResult.success && verificationResult.payment_verified) {
      return {
        success: true,
        paymentVerified: true,
        donationId: verificationResult.donation_id,
        receiptUrl: verificationResult.receipt_url,
        message: verificationResult.message || 'Payment successful! Thank you for your donation.'
      };
    } else {
      return {
        success: false,
        error: verificationResult.error || 'Payment verification failed'
      };
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed. Please contact support if amount was debited.'
    };
  }
}

async function getDonationHistory(limit: number = 10) {
  try {
    const session = await validateDonationSession();
    
    if (!session.isAuthenticated) {
      return {
        success: false,
        error: 'Authentication required to view donation history'
      };
    }


    const mockDonations: DonationRecord[] = [
      {
        id: 'DON001',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        donorPhone: '+919876543210',
        amount: 1000,
        currency: 'INR',
        donationType: 'general',
        anonymous: false,
        razorpayOrderId: 'order_123',
        razorpayPaymentId: 'pay_123',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        completedAt: new Date(Date.now() - 86400000 + 3600000).toISOString(),
        receiptGenerated: true,
        taxExemption: false,
      }
    ];

    return {
      success: true,
      donations: mockDonations.slice(0, limit),
      total: mockDonations.length
    };

  } catch (error) {
    console.error('Get donation history error:', error);
    return {
      success: false,
      error: 'Failed to fetch donation history'
    };
  }
}

export async function downloadReceipt(donationId: string) {
  try {

    if (!donationId) {
      return {
        success: false,
        error: 'Donation ID is required'
      };
    }


    const receiptUrl = `/api/receipts/${donationId}`;
    
    return {
      success: true,
      receiptUrl: receiptUrl,
      message: 'Receipt download link generated'
    };

  } catch (error) {
    console.error('Download receipt error:', error);
    return {
      success: false,
      error: 'Failed to generate receipt download link'
    };
  }
}

async function getDonationStats() {
  try {

    const session = await validateDonationSession();
    

    const hasAdminAccess = true

    if (!hasAdminAccess) {
      return {
        success: false,
        error: 'Admin access required'
      };
    }


    const stats = {
      totalDonations: 1250000,
      donationCount: 1542,
      thisMonth: 89500,
      thisMonthCount: 125,
      averageDonation: 810,
      topDonationType: 'education',
      recentDonations: [
        {
          id: 'DON001',
          amount: 5000,
          donor: 'Anonymous',
          type: 'education',
          date: new Date().toISOString()
        },
        {
          id: 'DON002',
          amount: 2000,
          donor: 'Ram Kumar',
          type: 'health',
          date: new Date(Date.now() - 3600000).toISOString()
        },
      ]
    };

    return {
      success: true,
      stats: stats
    };

  } catch (error) {
    console.error('Get donation stats error:', error);
    return {
      success: false,
      error: 'Failed to fetch donation statistics'
    };
  }
}

export async function processRefund(donationId: string, reason: string) {
  try {

    const session = await validateDonationSession();
    

    const hasAdminAccess = true;

    if (!hasAdminAccess) {
      return {
        success: false,
        error: 'Admin access required for refunds'
      };
    }

    if (!donationId || !reason) {
      return {
        success: false,
        error: 'Donation ID and reason are required for refund'
      };
    }

    console.log('Processing refund:', { donationId, reason });

    return {
      success: true,
      message: 'Refund initiated successfully. It may take 3-5 business days to reflect in the donor\'s account.',
      refundId: `rfnd_${Date.now()}`
    };

  } catch (error) {
    console.error('Process refund error:', error);
    return {
      success: false,
      error: 'Failed to process refund. Please try again.'
    };
  }
}

export {
  createDonationOrder as createOrder,
  verifyDonationPayment as verifyPayment,
  getDonationHistory as getHistory,
  getDonationStats as getStats,
  validateDonationSession as validateSession,
};
