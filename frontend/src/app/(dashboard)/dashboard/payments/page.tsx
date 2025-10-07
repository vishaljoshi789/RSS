"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStats } from "./_components/PaymentStats";
import { TransactionTable } from "./_components/TransactionTable";


export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
        <p className="text-muted-foreground">
          View and manage all payment transactions and donations
        </p>
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
  );
}