"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useDonationPayment } from '@/module/donation/hooks';
import { ArrowLeft, CheckCircle, AlertCircle, Wallet, CreditCard, Building, Smartphone } from 'lucide-react';

type PaymentMethod = 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'UPI';

interface ManualPaymentFormData {
  name: string;
  email: string;
  phone: string;
  amount: number;
  payment_for: string;
  notes: string;
  method: PaymentMethod;
  payment_details?: Record<string, unknown>;
}

interface AllPaymentDetails {
  cheque_number: string;
  cheque_date: string;
  bank_name: string;
  account_number: string;
  upi_transaction_id: string;
  reference_number: string;
}

const ManualPaymentPage = () => {
  const router = useRouter();
  const { mannualPayment, isProcessing, error, success, reset } = useDonationPayment();
  
  const [formData, setFormData] = useState<ManualPaymentFormData>({
    name: '',
    email: '',
    phone: '',
    amount: 0,
    payment_for: '',
    notes: '',
    method: 'CASH',
    payment_details: {}
  });

  const [paymentDetails, setPaymentDetails] = useState<AllPaymentDetails>({
    cheque_number: '',
    cheque_date: '',
    bank_name: '',
    account_number: '',
    upi_transaction_id: '',
    reference_number: ''
  });

  const handleInputChange = (field: keyof ManualPaymentFormData, value: string | number | PaymentMethod) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentDetailChange = (field: keyof AllPaymentDetails, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'CASH': return <Wallet className="w-4 h-4" />;
      case 'CHEQUE': return <CreditCard className="w-4 h-4" />;
      case 'BANK_TRANSFER': return <Building className="w-4 h-4" />;
      case 'UPI': return <Smartphone className="w-4 h-4" />;
      default: return <Wallet className="w-4 h-4" />;
    }
  };

  const renderPaymentDetailsFields = () => {
    switch (formData.method) {
      case 'CHEQUE':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cheque_number">Cheque Number</Label>
              <Input
                id="cheque_number"
                value={paymentDetails.cheque_number}
                onChange={(e) => handlePaymentDetailChange('cheque_number', e.target.value)}
                placeholder="Enter cheque number"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cheque_date">Cheque Date</Label>
              <Input
                id="cheque_date"
                type="date"
                value={paymentDetails.cheque_date}
                onChange={(e) => handlePaymentDetailChange('cheque_date', e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                value={paymentDetails.bank_name}
                onChange={(e) => handlePaymentDetailChange('bank_name', e.target.value)}
                placeholder="Enter bank name"
                className="h-10"
              />
            </div>
          </div>
        );
      
      case 'BANK_TRANSFER':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                value={paymentDetails.account_number}
                onChange={(e) => handlePaymentDetailChange('account_number', e.target.value)}
                placeholder="Enter account number"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              <Input
                id="reference_number"
                value={paymentDetails.reference_number}
                onChange={(e) => handlePaymentDetailChange('reference_number', e.target.value)}
                placeholder="Enter reference number"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                value={paymentDetails.bank_name}
                onChange={(e) => handlePaymentDetailChange('bank_name', e.target.value)}
                placeholder="Enter bank name"
                className="h-10"
              />
            </div>
          </div>
        );
      
      case 'UPI':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="upi_transaction_id">UPI Transaction ID</Label>
              <Input
                id="upi_transaction_id"
                value={paymentDetails.upi_transaction_id}
                onChange={(e) => handlePaymentDetailChange('upi_transaction_id', e.target.value)}
                placeholder="Enter UPI transaction ID"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              <Input
                id="reference_number"
                value={paymentDetails.reference_number}
                onChange={(e) => handlePaymentDetailChange('reference_number', e.target.value)}
                placeholder="Enter reference number"
                className="h-10"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.amount || !formData.payment_for) {
      return;
    }

    // Filter payment details based on method
    const relevantDetails: Record<string, unknown> = {};
    switch (formData.method) {
      case 'CHEQUE':
        relevantDetails.cheque_number = paymentDetails.cheque_number;
        relevantDetails.cheque_date = paymentDetails.cheque_date;
        relevantDetails.bank_name = paymentDetails.bank_name;
        break;
      case 'BANK_TRANSFER':
        relevantDetails.account_number = paymentDetails.account_number;
        relevantDetails.reference_number = paymentDetails.reference_number;
        relevantDetails.bank_name = paymentDetails.bank_name;
        break;
      case 'UPI':
        relevantDetails.upi_transaction_id = paymentDetails.upi_transaction_id;
        relevantDetails.reference_number = paymentDetails.reference_number;
        break;
      case 'CASH':
        break;
    }

    await mannualPayment({
      ...formData,
      payment_details: relevantDetails
    });
  };

  if (success) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Manual Payment Entry</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Entry Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Manual payment entry has been recorded successfully.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => { reset(); router.push('/dashboard/payments'); }}>
                View All Payments
              </Button>
              <Button variant="outline" onClick={reset}>
                Add Another Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manual Payment Entry</h1>
          <p className="text-muted-foreground">
            Record cash, cheque, and other manual payments
          </p>
        </div>
      </div>

      {error && (
        <Alert className="max-w-6xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        {/* Main Form - Takes 2/3 of the space */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Donor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      max="99999999.99"
                      step="0.01"
                      required
                      value={formData.amount || ''}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        if (value <= 99999999.99) {
                          handleInputChange('amount', value);
                        }
                      }}
                      placeholder="Enter amount (max: ₹99,999,999.99)"
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_for">Payment For</Label>
                  <Input
                    id="payment_for"
                    required
                    value={formData.payment_for}
                    onChange={(e) => handleInputChange('payment_for', e.target.value)}
                    placeholder="e.g., General Donation, Temple Fund, etc."
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional notes"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="method">Payment Method</Label>
                  <Select value={formData.method} onValueChange={(value) => handleInputChange('method', value)}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4" />
                          Cash
                        </div>
                      </SelectItem>
                      <SelectItem value="CHEQUE">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Cheque
                        </div>
                      </SelectItem>
                      <SelectItem value="BANK_TRANSFER">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Bank Transfer
                        </div>
                      </SelectItem>
                      <SelectItem value="UPI">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          UPI
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.method !== 'CASH' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      {getPaymentMethodIcon(formData.method)}
                      <Label>Payment Details</Label>
                      <Badge variant="secondary">{formData.method}</Badge>
                    </div>
                    {renderPaymentDetailsFields()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isProcessing} className="px-8 h-10">
                {isProcessing ? 'Recording...' : 'Record Payment'}
              </Button>
            </div>
          </form>
        </div>

        {/* Payment Method Info Sidebar - Takes 1/3 of the space */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getPaymentMethodIcon(formData.method)}
                Payment Method Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.method === 'CASH' && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Cash Payment</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      Direct cash payment received in person. No additional details required.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Guidelines:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Ensure amount is counted accurately</li>
                      <li>• Issue receipt to donor</li>
                      <li>• Keep cash secure until deposit</li>
                      <li>• Record transaction immediately</li>
                    </ul>
                  </div>
                </div>
              )}

              {formData.method === 'CHEQUE' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-800">Cheque Payment</h3>
                    </div>
                    <p className="text-sm text-blue-700">
                      Payment via bank cheque. Requires cheque details and bank information.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Required Information:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Cheque number</li>
                      <li>• Date on cheque</li>
                      <li>• Bank name</li>
                      <li>• Verify signature</li>
                    </ul>
                  </div>
                </div>
              )}

              {formData.method === 'BANK_TRANSFER' && (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-800">Bank Transfer</h3>
                    </div>
                    <p className="text-sm text-purple-700">
                      Direct bank to bank transfer. Verify transaction details carefully.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Required Information:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Sender account number</li>
                      <li>• Bank reference number</li>
                      <li>• Sender bank name</li>
                      <li>• Transaction confirmation</li>
                    </ul>
                  </div>
                </div>
              )}

              {formData.method === 'UPI' && (
                <div className="space-y-4">
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-800">UPI Payment</h3>
                    </div>
                    <p className="text-sm text-orange-700">
                      Unified Payments Interface transaction. Fast and secure digital payment.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Required Information:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• UPI transaction ID</li>
                      <li>• Reference number</li>
                      <li>• Verify payment app screenshot</li>
                      <li>• Confirm transaction success</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <h4 className="font-medium text-sm mb-2">Need Help?</h4>
                <p className="text-xs text-muted-foreground">
                  Contact the finance team if you need assistance with payment recording or verification.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManualPaymentPage;