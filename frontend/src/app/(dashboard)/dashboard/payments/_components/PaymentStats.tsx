"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Calendar,
  Loader2
} from "lucide-react";
import { usePaymentStats } from "@/module/dashboard/Payments/hooks";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function PaymentStats() {
  const { stats, loading, error, refetch } = usePaymentStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statsConfig = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.total_revenue || 0),
      icon: DollarSign,
      description: "All-time revenue",
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      change: "+12.5%"
    },
    {
      title: "This Month",
      value: formatCurrency(stats.monthly_revenue || 0),
      icon: TrendingUp,
      description: "Current month revenue",
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      change: "+8.2%"
    },
    {
      title: "Total Transactions",
      value: (stats.total_transactions || 0).toLocaleString(),
      icon: CreditCard,
      description: "All transactions",
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Successful",
      value: (stats.successful_transactions || 0).toLocaleString(),
      icon: CheckCircle2,
      description: "Completed payments",
      color: "text-green-600",
      bgColor: "bg-green-500/10",
      change: "95.1%"
    },
    {
      title: "Failed",
      value: (stats.failed_transactions || 0).toLocaleString(),
      icon: XCircle,
      description: "Failed transactions",
      color: "text-red-600",
      bgColor: "bg-red-500/10",
      change: "4.9%"
    },
    {
      title: "Pending",
      value: (stats.pending_transactions || 0).toLocaleString(),
      icon: Clock,
      description: "Processing payments",
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Active Subscribers",
      value: (stats.active_subscribers || 0).toLocaleString(),
      icon: Users,
      description: "Monthly subscribers",
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/10",
    },
    {
      title: "This Month Donations",
      value: (stats.this_month_donations || 0).toLocaleString(),
      icon: Calendar,
      description: "One-time donations",
      color: "text-pink-600",
      bgColor: "bg-pink-500/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Unable to load payment stats</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={refetch}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  {stat.change && (
                    <span className={`text-xs font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {stat.change}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
