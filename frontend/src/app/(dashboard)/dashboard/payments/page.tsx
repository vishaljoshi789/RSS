"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentStats } from "./_components/PaymentStats";
import { TransactionTable } from "./_components/TransactionTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaymentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);

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
          />
        </CardContent>
      </Card>
    </div>
  );
}