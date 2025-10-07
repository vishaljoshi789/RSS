"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CreditCard,
  Building2,
  Wallet,
  Calendar,
  DollarSign,
  FileText,
  Phone,
  Mail,
  User,
  Hash,
  CheckCircle2,
  XCircle,
  Clock,
  Receipt,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Payment } from "@/module/dashboard/Payments/hooks";

interface ViewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export function ViewPaymentModal({
  isOpen,
  onClose,
  payment,
}: ViewPaymentModalProps) {
  if (!payment) return null;

  const paymentMethod = payment.payment_details?.method || payment.method || "Unknown";
  const methodDetails = payment.payment_details?.method_details;
  const acquirerData = payment.payment_details?.acquirer_data;
  const currency = payment.payment_details?.currency || "INR";

  const getStatusConfig = (status: Payment["status"]) => {
    const configs = {
      COMPLETED: {
        icon: CheckCircle2,
        label: "Completed",
        className: "bg-green-500 hover:bg-green-600",
        iconColor: "text-green-600",
      },
      FAILED: {
        icon: XCircle,
        label: "Failed",
        className: "bg-red-500 hover:bg-red-600",
        iconColor: "text-red-600",
      },
      PENDING: {
        icon: Clock,
        label: "Pending",
        className: "bg-orange-500 hover:bg-orange-600",
        iconColor: "text-orange-600",
      },
    };
    return configs[status];
  };

  const getPaymentMethodDisplay = () => {
    const method = paymentMethod.toLowerCase();
    
    if (method === "card" && methodDetails?.card) {
      const card = methodDetails.card;
      return (
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 relative flex items-center justify-center">
            <Image 
              src="/Svg/credit.svg" 
              alt="Card" 
              width={24} 
              height={24}
              className="object-contain"
            />
          </div>
          <span>
            {card.network} {card.type ? `(${card.type})` : ""}
            {card.last4 ? ` •••• ${card.last4}` : ""}
          </span>
        </div>
      );
    } else if (method === "upi" && methodDetails?.upi) {
      return (
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 relative flex items-center justify-center">
            <Image 
              src="/Svg/upi.svg" 
              alt="UPI" 
              width={24} 
              height={24}
              className="object-contain"
            />
          </div>
          <span>UPI {methodDetails.upi.vpa ? `(${methodDetails.upi.vpa})` : ""}</span>
        </div>
      );
    } else if (method === "netbanking" && methodDetails?.netbanking) {
      return (
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 relative flex items-center justify-center">
            <Image 
              src="/Svg/building.svg" 
              alt="Net Banking" 
              width={24} 
              height={24}
              className="object-contain"
            />
          </div>
          <span>Net Banking {methodDetails.netbanking.bank ? `- ${methodDetails.netbanking.bank}` : ""}</span>
        </div>
      );
    } else if (method === "wallet" && methodDetails?.wallet) {
      return (
        <div className="flex items-center gap-3">
          <Wallet className="h-6 w-6 text-orange-600" />
          <span>Wallet {methodDetails.wallet.wallet ? `(${methodDetails.wallet.wallet})` : ""}</span>
        </div>
      );
    }
    
    return paymentMethod.toUpperCase();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(dateString));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const statusConfig = getStatusConfig(payment.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Receipt className="h-6 w-6" />
                Payment Details
              </DialogTitle>
              <DialogDescription className="mt-2">
                Transaction ID: {payment.order_id}
              </DialogDescription>
            </div>
            <Badge className={`${statusConfig.className} text-white`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Customer Information
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(payment.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-lg">{payment.name}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {payment.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {payment.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Payment Summary
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Amount</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(payment.amount, currency)}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Payment For</div>
                <div className="text-lg font-semibold capitalize">
                  {payment.payment_for}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Payment Method
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Method</span>
                <span className="font-medium">{getPaymentMethodDisplay()}</span>
              </div>
              
              {/* Card specific details */}
              {paymentMethod === "card" && methodDetails?.card && (
                <>
                  {methodDetails.card.issuer && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Issuing Bank</span>
                      <span className="font-medium capitalize">{methodDetails.card.issuer}</span>
                    </div>
                  )}
                </>
              )}
              
              {/* Bank details for netbanking */}
              {paymentMethod === "netbanking" && methodDetails?.netbanking?.bank && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bank</span>
                  <span className="font-medium capitalize">{methodDetails.netbanking.bank}</span>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Hash className="h-5 w-5 text-indigo-600" />
              Transaction Details
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Order ID</span>
                <span className="font-mono text-sm">{payment.order_id}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment ID</span>
                <span className="font-mono text-sm">{payment.payment_id}</span>
              </div>
              
              {acquirerData?.bank_transaction_id && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bank Transaction ID</span>
                    <span className="font-mono text-sm">{acquirerData.bank_transaction_id}</span>
                  </div>
                </>
              )}
              
              {acquirerData?.rrn && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">RRN</span>
                    <span className="font-mono text-sm">{acquirerData.rrn}</span>
                  </div>
                </>
              )}
              
              {acquirerData?.auth_code && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Auth Code</span>
                    <span className="font-mono text-sm">{acquirerData.auth_code}</span>
                  </div>
                </>
              )}
              
              {acquirerData?.upi_transaction_id && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">UPI Transaction ID</span>
                    <span className="font-mono text-sm">{acquirerData.upi_transaction_id}</span>
                  </div>
                </>
              )}
              
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Date & Time
                </span>
                <span className="text-sm">{formatDate(payment.timestamp)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                Notes
              </h3>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">{payment.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
