"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Receipt } from '@/module/donation/component';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

function ReceiptContent() {
  const searchParams = useSearchParams();
  const [receiptData, setReceiptData] = useState({
    donatedBy: '',
    mobileNo: '',
    dateOfDonation: '',
    donationMode: 'Online payment',
    donationAmountWords: '',
    donationAmountNumbers: 0,
    receiptNumber: '',
    location: 'state',
  });

  useEffect(() => {
    setReceiptData({
      donatedBy: searchParams.get('name') || '',
      mobileNo: searchParams.get('phone') || '',
      dateOfDonation: searchParams.get('date') || new Date().toLocaleDateString('en-IN'),
      donationMode: searchParams.get('mode') || 'Online payment',
      donationAmountWords: searchParams.get('amountWords') || '',
      donationAmountNumbers: Number(searchParams.get('amount')) || 0,
      receiptNumber: searchParams.get('receiptNumber') || '',
      location: searchParams.get('location') || 'state',
    });
  }, [searchParams]);

  const handleDownload = () => {
    // Trigger print dialog which allows "Save as PDF"
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Download button - hidden when printing */}
      <div className="max-w-4xl mx-auto mb-4 print:hidden flex gap-4 justify-center">
        <Button 
          onClick={handleDownload}
          size="lg"
          className="gap-2"
        >
          <Download className="h-5 w-5" />
          Download Receipt
        </Button>
      </div>

      {/* Receipt */}
      <Receipt {...receiptData} />
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading receipt...</div>}>
      <ReceiptContent />
    </Suspense>
  );
}
