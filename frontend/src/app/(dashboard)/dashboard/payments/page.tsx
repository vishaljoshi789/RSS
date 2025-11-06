"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStats } from "./_components/PaymentStats";
import { TransactionTable } from "./_components/TransactionTable";
import { Plus, Wallet } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";


export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <RoleGuard allowedRoles="auto" showUnauthorized={true}>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
            <p className="text-muted-foreground">
              View and manage all payment transactions and donations
            </p>
          </div>
          <Link href="/dashboard/payments/mannual">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Manual Payment
            </Button>
          </Link>
        </div>

        
        <PaymentStats />

        
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
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