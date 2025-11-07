"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Button } from "@/components/ui/button";
import { Copy, Users2, UserCheck2, UserPlus2, Check, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { getUserImageUrl as resolveUserImageUrl } from "@/lib/media";
import Cookies from "js-cookie";

import type { User } from "@/types/auth.types";
import type { ReferralData } from "@/module/dashboard/referrals/hooks";

interface StatCardProps {
  user: User | null;
  referralData: ReferralData;
  loading: boolean;
  error: string | null;
}

interface ReferralItem {
  id?: number | string;
  name?: string;
  email?: string;
  image?: string;
  is_verified?: boolean;
  is_member_account?: boolean;
  date_joined?: string;
}

const FALLBACK_INITIALS = "US";

const StatCard: React.FC<StatCardProps> = ({
  user,
  referralData,
  loading,
  error,
}) => {
  const [copyState, setCopyState] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const referrals: ReferralItem[] = useMemo(
    () => referralData?.referrals || [],
    [referralData?.referrals]
  );

  const totalReferrals = referralData?.total_referrals || referrals.length || 0;
  const verifiedReferrals = referrals.filter((item) => item.is_verified).length;
  const memberReferrals = referrals.filter(
    (item) => item.is_member_account
  ).length;

  const stats: { label: string; value: number; icon: LucideIcon }[] = [
    {
      label: "Total Referrals",
      value: totalReferrals,
      icon: Users2,
    },
    {
      label: "Verified Referrals",
      value: verifiedReferrals,
      icon: UserCheck2,
    },
    {
      label: "Member Referrals",
      value: memberReferrals,
      icon: UserPlus2,
    },
  ];

  const referralLink = useMemo(() => {
    if (!user?.user_id) return "";
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || "";
    return origin ? `${origin}/auth/register?ref=${user.user_id}` : "";
  }, [user?.user_id]);

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopyState("success");
      toast.success("Referral link copied to clipboard");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (copyError) {
      setCopyState("error");
      toast.error("Unable to copy referral link");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const displayInitials = useMemo(() => {
    if (!user?.name) return FALLBACK_INITIALS;
    return user.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  const userImageUrl = useMemo(
    () => resolveUserImageUrl(user?.image),
    [user?.image]
  );

  async function getpdf() {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      console.error("Access token not found in cookies!");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/documents/generate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ document_type: "idcard" }),
        }
      );

      if (!res.ok) {
        console.error("Error generating PDF:", await res.text());
        return;
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "idcard.pdf";
      link.click();

      setTimeout(() => window.URL.revokeObjectURL(url), 5000);

      console.log("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }

  async function getVolunteerCertificate() {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      console.error("Access token not found in cookies!");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboard/documents/generate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ document_type: "certificate" }),
        }
      );

      if (!res.ok) {
        console.error("Error generating PDF:", await res.text());
        return;
      }

      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "volunteer_certificate.pdf";
      link.click();

      setTimeout(() => window.URL.revokeObjectURL(url), 5000);

      console.log("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-semibold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="">
          <CardHeader>
            <CardTitle>Referral Overview</CardTitle>
            <CardDescription>
              {loading
                ? "Fetching referral details..."
                : `Showing ${referrals.length} referred candidates`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <Alert variant="destructive" className="mx-4 mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="h-[380px] flex flex-col">
              {loading ? (
                <div className="space-y-3 p-6 flex-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((key) => (
                    <Skeleton key={key} className="h-12 w-full" />
                  ))}
                </div>
              ) : referrals.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">कोई रेफरल डेटा उपलब्ध नहीं है।</p>
                    <p className="text-sm">जब आप किसी को रेफर करेंगे तो वे यहाँ दिखाई देंगे।</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10 border-b">
                        <TableRow>
                          <TableHead className="bg-background">नाम</TableHead>
                          <TableHead className="bg-background">ईमेल</TableHead>
                          <TableHead className="bg-background">स्थिति</TableHead>
                          <TableHead className="w-[120px] bg-background">जॉइनिंग</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referrals.map((referral, idx) => {
                          const rowKey =
                            referral.id ?? referral.email ?? `referral-${idx}`;
                          return (
                            <TableRow key={rowKey} className="hover:bg-muted/50">
                              <TableCell className="font-medium">
                                {referral.name
                                  ? referral.name.charAt(0).toUpperCase() +
                                    referral.name.slice(1).toLowerCase()
                                  : "N/A"}
                              </TableCell>
                              <TableCell>{referral.email || "-"}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  <Badge
                                    variant="outline"
                                    className="text-green-600"
                                  >
                                    Success
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                {referral.date_joined
                                  ? format(
                                      new Date(referral.date_joined),
                                      "dd MMM yyyy"
                                    )
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  {referrals.length > 0 && (
                    <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center sticky bottom-0">
                      कुल {referrals.length} रेफरल रिकॉर्ड दिखाई जा रहे हैं।
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky lg:top-24">
        <Card className="h-fit">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                {userImageUrl && (
                  <AvatarImage src={userImageUrl} alt={user?.name || "User"} />
                )}
                <AvatarFallback className="text-base font-medium">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {user?.name
                    ? user.name.charAt(0).toUpperCase() +
                      user.name.slice(1).toLowerCase()
                    : "User"}
                </CardTitle>
                <CardDescription>
                  {user?.email || "ईमेल उपलब्ध नहीं"}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {user?.is_verified && (
                <Badge variant="outline" className="text-green-600">
                  Verified
                </Badge>
              )}
              {user?.is_member_account && (
                <Badge variant="outline" className="text-blue-600">
                  Member
                </Badge>
              )}
              {user?.is_admin_account && (
                <Badge variant="outline" className="text-red-600">
                  Admin
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User ID Section */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">User ID</p>
              <div className="rounded-md border bg-muted px-3 py-2 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]">
                <p className="font-mono text-sm text-foreground">{user?.user_id ?? "N/A"}</p>
              </div>
            </div>

            {/* Referral Link Section */}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">रेफरल लिंक</p>
                <p className="text-xs text-muted-foreground mb-3">
                  अपनी रेफरल लिंक साझा करें और अधिक सदस्यों को जोड़ें।
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 truncate rounded-md border bg-muted px-3 py-2 text-xs shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]">
                  {referralLink || "रेफरल लिंक उपलब्ध नहीं"}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                  disabled={!referralLink || copyState !== "idle"}
                  onClick={handleCopy}
                  title={
                    copyState === "success"
                      ? "Copied!"
                      : copyState === "error"
                      ? "Failed to copy"
                      : "Copy referral link"
                  }
                >
                  {copyState === "success" ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : copyState === "error" ? (
                    <X className="h-4 w-4 text-red-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm font-medium text-foreground">Quick Actions</p>
              <div className="space-y-2">
                <Button 
                  onClick={getpdf} 
                  variant="default"
                  className="w-full justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  size="sm"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ID Card PDF
                </Button>
                <Button 
                  onClick={getVolunteerCertificate}
                  variant="default"
                  className="w-full justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  size="sm"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Volunteer Certificate
                </Button>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm font-medium text-foreground">Profile Status</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Account Type:</span>
                  <span className="font-medium">
                    {user?.is_admin_account ? "Admin" : 
                     user?.is_member_account ? "Member" : "Volunteer"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Verification:</span>
                  <span className={`font-medium ${user?.is_verified ? 'text-green-600' : 'text-orange-500'}`}>
                    {user?.is_verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Referrals:</span>
                  <span className="font-medium text-blue-600">{totalReferrals}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatCard;
