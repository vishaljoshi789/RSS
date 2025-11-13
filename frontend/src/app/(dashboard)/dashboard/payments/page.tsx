"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStats } from "./_components/PaymentStats";
import { TransactionTable } from "./_components/TransactionTable";
import { Plus } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";


export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <RoleGuard allowedRoles="auto" showUnauthorized={true}>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Payment Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              View and manage all payment transactions and donations
            </p>
          </div>
          <Link href="/dashboard/payments/mannual" className="w-full sm:w-auto">
            <Button className="flex items-center gap-2 w-full sm:w-auto">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">Add Manual Payment</span>
            </Button>
          </Link>
        </div>

        
        <PaymentStats />

        
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Transaction History</CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <TransactionTable 
              page={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}