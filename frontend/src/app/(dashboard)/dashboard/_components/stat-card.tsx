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
      if (copyError instanceof Error) {
        console.error("Copy error:", copyError);
      }
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
      toast.error("Authentication required", {
        description: "Please login again to download your ID card",
      });
      return;
    }

    toast.loading("Generating ID card PDF...", { id: "pdf-download" });

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
        const errorText = await res.text();
        let errorMessage = "Failed to generate ID card";
        
        switch (res.status) {
          case 400:
            errorMessage = "Invalid request. Please check your account details.";
            break;
          case 401:
            errorMessage = "Session expired. Please login again.";
            break;
          case 403:
            errorMessage = "You don't have permission to download ID card.";
            break;
          case 404:
            errorMessage = "ID card service not found.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = `Error: ${res.status} - ${res.statusText}`;
        }
        
        toast.error(errorMessage, {
          id: "pdf-download",
          description: errorText || "Please contact support if the issue persists.",
        });
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "idcard.pdf";
      link.click();

      setTimeout(() => window.URL.revokeObjectURL(url), 5000);

      toast.success("ID card downloaded successfully!", {
        id: "pdf-download",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Network error", {
        id: "pdf-download",
        description: "Failed to connect to the server. Please check your internet connection.",
      });
    }
  }

  async function getVolunteerCertificate() {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      toast.error("Authentication required", {
        description: "Please login again to download your certificate",
      });
      return;
    }

    toast.loading("Generating volunteer certificate PDF...", { id: "certificate-download" });

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
        const errorText = await res.text();
        let errorMessage = "Failed to generate volunteer certificate";
        
        switch (res.status) {
          case 400:
            errorMessage = "Invalid request. Please check your account details.";
            break;
          case 401:
            errorMessage = "Session expired. Please login again.";
            break;
          case 403:
            errorMessage = "You don't have permission to download certificate.";
            break;
          case 404:
            errorMessage = "Certificate service not found.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = `Error: ${res.status} - ${res.statusText}`;
        }
        
        toast.error(errorMessage, {
          id: "certificate-download",
          description: errorText || "Please contact support if the issue persists.",
        });
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "volunteer_certificate.pdf";
      link.click();

      setTimeout(() => window.URL.revokeObjectURL(url), 5000);

      toast.success("Volunteer certificate downloaded successfully!", {
        id: "certificate-download",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Network error", {
        id: "certificate-download",
        description: "Failed to connect to the server. Please check your internet connection.",
      });
    }
  }

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)]">
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="text-xs sm:text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                {loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-xl sm:text-2xl font-semibold">{stat.value}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">Referral Overview</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {loading
                ? "Fetching referral details..."
                : `Showing ${referrals.length} referred candidates`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <Alert variant="destructive" className="mx-4 mb-4">
                <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="h-[300px] sm:h-[380px] flex flex-col">
              {loading ? (
                <div className="space-y-3 p-4 sm:p-6 flex-1">
                  {[0, 1, 2, 3, 4].map((key) => (
                    <Skeleton key={key} className="h-10 sm:h-12 w-full" />
                  ))}
                </div>
              ) : referrals.length === 0 ? (
                <div className="p-4 sm:p-6 text-xs sm:text-sm text-muted-foreground flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-base sm:text-lg font-medium mb-2">कोई रेफरल डेटा उपलब्ध नहीं है।</p>
                    <p className="text-xs sm:text-sm">जब आप किसी को रेफर करेंगे तो वे यहाँ दिखाई देंगे।</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-x-auto overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background z-10 border-b">
                        <TableRow>
                          <TableHead className="bg-background text-xs sm:text-sm min-w-[120px]">नाम</TableHead>
                          <TableHead className="bg-background text-xs sm:text-sm min-w-[150px] hidden sm:table-cell">ईमेल</TableHead>
                          <TableHead className="bg-background text-xs sm:text-sm">स्थिति</TableHead>
                          <TableHead className="bg-background text-xs sm:text-sm w-[100px] sm:w-[120px]">जॉइनिंग</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referrals.map((referral, idx) => {
                          const rowKey =
                            referral.id ?? referral.email ?? `referral-${idx}`;
                          return (
                            <TableRow key={rowKey} className="hover:bg-muted/50">
                              <TableCell className="font-medium text-xs sm:text-sm">
                                {referral.name
                                  ? referral.name.charAt(0).toUpperCase() +
                                    referral.name.slice(1).toLowerCase()
                                  : "N/A"}
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm hidden sm:table-cell">{referral.email || "-"}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  <Badge
                                    variant="outline"
                                    className="text-green-600 text-[10px] sm:text-xs"
                                  >
                                    Success
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs sm:text-sm">
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
                    <div className="border-t bg-muted/30 px-4 py-2 text-[10px] sm:text-xs text-muted-foreground text-center sticky bottom-0">
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
          <CardHeader className="space-y-3 sm:space-y-4 px-4 sm:px-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
                {userImageUrl && (
                  <AvatarImage src={userImageUrl} alt={user?.name || "User"} />
                )}
                <AvatarFallback className="text-sm sm:text-base font-medium">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-xl truncate">
                  {user?.name
                    ? user.name.charAt(0).toUpperCase() +
                      user.name.slice(1).toLowerCase()
                    : "User"}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm truncate">
                  {user?.email || "ईमेल उपलब्ध नहीं"}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {user?.is_verified && (
                <Badge variant="outline" className="text-green-600 text-[10px] sm:text-xs">
                  Verified
                </Badge>
              )}
              {user?.is_member_account && (
                <Badge variant="outline" className="text-blue-600 text-[10px] sm:text-xs">
                  Member
                </Badge>
              )}
              {user?.is_admin_account && (
                <Badge variant="outline" className="text-red-600 text-[10px] sm:text-xs">
                  Admin
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            {/* User ID Section */}
            <div className="space-y-2">
              <p className="text-xs sm:text-sm font-medium text-foreground">User ID</p>
              <div className="rounded-md border bg-muted px-2 sm:px-3 py-1.5 sm:py-2 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]">
                <p className="font-mono text-xs sm:text-sm text-foreground truncate">{user?.user_id ?? "N/A"}</p>
              </div>
            </div>

            {/* Referral Link Section */}
            {user?.is_verified && (
              <div className="space-y-2 sm:space-y-3">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-foreground mb-1 sm:mb-2">रेफरल लिंक</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">
                    अपनी रेफरल लिंक साझा करें और अधिक सदस्यों को जोड़ें।
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 truncate rounded-md border bg-muted px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]">
                    {referralLink || "रेफरल लिंक उपलब्ध नहीं"}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="shrink-0 h-8 w-8 sm:h-10 sm:w-10 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
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
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    ) : copyState === "error" ? (
                      <X className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                    ) : (
                      <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons Section */}
            <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t">
              <p className="text-xs sm:text-sm font-medium text-foreground">Quick Actions</p>
              <div className="space-y-1.5 sm:space-y-2">
                {user?.is_member_account && (
                  <Button 
                    onClick={getpdf} 
                    variant="default"
                    className="w-full justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs sm:text-sm h-8 sm:h-9"
                    size="sm"
                  >
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ID Card PDF
                  </Button>
                )}
                {user?.is_volunteer && (
                  <Button 
                    onClick={getVolunteerCertificate}
                    variant="default"
                    className="w-full justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xs sm:text-sm h-8 sm:h-9"
                    size="sm"
                  >
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Volunteer Certificate
                  </Button>
                )}
                {!user?.is_member_account && !user?.is_volunteer && (
                  <p className="text-xs sm:text-sm text-muted-foreground text-center py-3 sm:py-4">
                    No documents available
                  </p>
                )}
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t">
              <p className="text-xs sm:text-sm font-medium text-foreground">Profile Status</p>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">Account Type:</span>
                  <span className="font-medium text-right">
                    {user?.is_admin_account ? "Admin" : 
                     user?.is_member_account ? "Member" : "Volunteer"}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">Verification:</span>
                  <span className={`font-medium text-right ${user?.is_verified ? 'text-green-600' : 'text-orange-500'}`}>
                    {user?.is_verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <span className="text-muted-foreground">Referrals:</span>
                  <span className="font-medium text-blue-600 text-right">{totalReferrals}</span>
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
