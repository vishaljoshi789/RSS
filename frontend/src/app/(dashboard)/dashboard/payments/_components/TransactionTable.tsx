"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Download,
  Eye,
  ArrowUpDown,
  Loader2,
  Building2,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ViewPaymentModal } from "@/module/dashboard/Payments/components/view-payment-model";
import { usePayments, type Payment } from "@/module/dashboard/Payments/hooks";

import { toast } from "sonner";


interface TransactionTableProps {
  page: number;
  pageSize: number;
}

export function TransactionTable({ page, pageSize }: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPaymentDetails, setLoadingPaymentDetails] = useState(false);
  
  // Use the payments hook
  const { payments, loading, error, getPaymentById } = usePayments(page, pageSize);

  const handleViewPayment = async (payment: Payment) => {
    try {
      setLoadingPaymentDetails(true);
      
      // Fetch fresh payment details from the API
      const paymentDetails = await getPaymentById(payment.id);
      
      if (paymentDetails) {
        setSelectedPayment(paymentDetails);
        setIsModalOpen(true);
      } else {
        toast("Failed to load payment details", {
          description: "Unable to fetch payment information. Please try again."
        });
      }
    } catch (error: any) {
      console.error("Error fetching payment details:", error);
      // Show error toast
      const toast = await import("sonner");
      toast.toast.error("Failed to load payment details", {
        description: error.message || "An error occurred while fetching payment information."
      });
    } finally {
      setLoadingPaymentDetails(false);
    }
  };

  const getStatusBadge = (status: Payment["status"]) => {
    const variants = {
      COMPLETED: {
        variant: "default" as const,
        label: "Completed",
        class: "bg-green-500 hover:bg-green-600",
      },
      FAILED: { variant: "destructive" as const, label: "Failed", class: "" },
      PENDING: {
        variant: "secondary" as const,
        label: "Pending",
        class: "bg-orange-500 hover:bg-orange-600 text-white",
      },
    };
    const config = variants[status];
    return (
      <Badge variant={config.variant} className={config.class}>
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
    return (
      <Badge variant="outline" className="border-blue-500 text-blue-600">
        {typeLabel}
      </Badge>
    );
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const sortedPayments = [...payments].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Payment ID",
      "Customer Name",
      "Email",
      "Phone",
      "Amount",
      "Status",
      "Payment Method",
      "Method Details",
      "Payment For",
      "Date",
      "Notes",
    ];

    const rows = sortedPayments.map((payment) => {
      // Get payment method details
      const method = payment.payment_details?.method || payment.method || "N/A";
      let methodDetail = "";
      
      if (payment.payment_details?.method_details) {
        const details = payment.payment_details.method_details;
        if (details.card && details.card.network) {
          methodDetail = `${details.card.network} ${details.card.type || ""} ****${details.card.last4 || ""}`.trim();
        } else if (details.upi && details.upi.vpa) {
          methodDetail = details.upi.vpa;
        } else if (details.netbanking && details.netbanking.bank) {
          methodDetail = details.netbanking.bank;
        } else if (details.wallet && details.wallet.wallet) {
          methodDetail = details.wallet.wallet;
        }
      }
      
      return [
        payment.order_id,
        payment.payment_id,
        payment.name,
        payment.email,
        payment.phone,
        payment.amount,
        payment.status,
        method,
        methodDetail,
        payment.payment_for,
        new Intl.DateTimeFormat("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(payment.timestamp)),
        payment.notes || "",
      ];
    });

    
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            
            const cellStr = String(cell);
            if (
              cellStr.includes(",") ||
              cellStr.includes('"') ||
              cellStr.includes("\n")
            ) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(",")
      ),
    ].join("\n");

    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    
    const fileName = `transactions_${
      new Date().toISOString().split("T")[0]
    }.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPaymentMethodIcon = (payment: Payment) => {
    // Get method from payment_details or fallback to method field
    const method = payment.payment_details?.method || payment.method;
    
    if (!method) {
      return <span className="text-sm text-muted-foreground">N/A</span>;
    }

    const methodLower = method.toLowerCase();

    // UPI Payment
    if (methodLower === "upi") {
      const vpa = payment.payment_details?.method_details?.upi?.vpa;
      return (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 relative flex items-center justify-center">
            <Image
              src="/Svg/upi.svg"
              alt="UPI"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">UPI</span>
            {vpa && <span className="text-xs text-muted-foreground">{vpa}</span>}
          </div>
        </div>
      );
    }

    // Card Payment
    if (methodLower === "card") {
      const cardDetails = payment.payment_details?.method_details?.card;
      const cardInfo = cardDetails
        ? `${cardDetails.network || ""} ${cardDetails.type || ""}`.trim()
        : "Card";
      const last4 = cardDetails?.last4;
      
      return (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 relative flex items-center justify-center">
            <Image
              src="/Svg/credit.svg"
              alt="Card"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{cardInfo}</span>
            {last4 && (
              <span className="text-xs text-muted-foreground">
                •••• {last4}
              </span>
            )}
          </div>
        </div>
      );
    }

    // Net Banking
    if (methodLower === "netbanking") {
      const bank = payment.payment_details?.method_details?.netbanking?.bank;
      return (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 relative flex items-center justify-center">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Net Banking</span>
            {bank && (
              <span className="text-xs text-muted-foreground capitalize">
                {bank}
              </span>
            )}
          </div>
        </div>
      );
    }

    // Wallet Payment
    if (methodLower === "wallet") {
      const walletName = payment.payment_details?.method_details?.wallet?.wallet;
      return (
        <div className="flex items-center gap-2">
          <Wallet className="h-6 w-6 text-orange-600" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Wallet</span>
            {walletName && (
              <span className="text-xs text-muted-foreground capitalize">
                {walletName}
              </span>
            )}
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <span className="text-sm capitalize">
        {method}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, payment ID, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
            autoComplete="off"
            type="text"
            disabled={loading}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="donation">Donation</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
            <SelectItem value="membership">Membership</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="gap-2"
          onClick={exportToCSV}
          disabled={sortedPayments.length === 0}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={toggleSortOrder}
                  className="h-8 p-0 hover:bg-transparent"
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : sortedPayments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              sortedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium font-mono text-xs">
                    {payment.order_id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getInitials(payment.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {payment.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {payment.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(payment.amount, "INR")}
                  </TableCell>
                  <TableCell>{getTypeBadge(payment.payment_for)}</TableCell>
                  <TableCell>
                    {getPaymentMethodIcon(payment)}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(payment.timestamp)}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewPayment(payment)}
                            disabled={loadingPaymentDetails}
                          >
                            {loadingPaymentDetails ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ViewPaymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />
    </div>
  );
}
