"use client";

import React from "react";
import { Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { ReferralsTableProps } from "../referal";

export const ReferralsTable: React.FC<ReferralsTableProps> = ({
  referrals,
  loading,
  error,
  onReferralClick,
}) => {
  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          रेफरल की सूची
        </CardTitle>
        <CardDescription>
          इस उपयोगकर्ता द्वारा रेफर किए गए सभी लोग
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : referrals.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-16 w-16 text-muted-foreground opacity-20" />
              <p className="mt-4 text-sm text-muted-foreground">
                इस उपयोगकर्ता के लिए कोई रेफरल नहीं मिला
              </p>
            </div>
          ) : (
            <Table>
              <TableCaption>कुल {referrals.length} रेफरल रिकॉर्ड</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>नाम</TableHead>
                  <TableHead>ईमेल</TableHead>
                  <TableHead>फोन</TableHead>
                  <TableHead>रेफरल</TableHead>
                  <TableHead className="w-[120px]">जॉइनिंग</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral, idx) => {
                  const rowKey = referral.id ?? referral.email ?? `ref-${idx}`;
                  return (
                    <TableRow key={rowKey}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {referral.image && (
                              <AvatarImage
                                src={referral.image}
                                alt={referral.name}
                              />
                            )}
                            <AvatarFallback className="text-xs">
                              {getInitials(referral.name)}
                            </AvatarFallback>
                          </Avatar>
                          {referral.name || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {referral.email || "-"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {referral.phone || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer transition-all hover:scale-105"
                            onClick={() =>
                              referral.user_id &&
                              onReferralClick(
                                referral.user_id,
                                referral.name || "Unknown"
                              )
                            }
                          >
                            <Users className="mr-1 h-3 w-3" />
                            {referral.referral_count || 0}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {referral.date_joined
                          ? format(new Date(referral.date_joined), "dd MMM yyyy")
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
