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
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');

  const referrals: ReferralItem[] = useMemo(
    () => referralData?.referrals || [],
    [referralData?.referrals]
  );

  const totalReferrals = referralData?.total_referrals || referrals.length || 0;
  const verifiedReferrals = referrals.filter((item) => item.is_verified).length;
  const memberReferrals = referrals.filter((item) => item.is_member_account)
    .length;

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
      setCopyState('success');
      toast.success("Referral link copied to clipboard");
      setTimeout(() => setCopyState('idle'), 2000);
    } catch (copyError) {
      setCopyState('error');
      toast.error("Unable to copy referral link");
      setTimeout(() => setCopyState('idle'), 2000);
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

  const userImageUrl = useMemo(() => resolveUserImageUrl(user?.image), [user?.image]);

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

        <Card>
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

            <div className="max-h-[420px] overflow-x-auto">
              {loading ? (
                <div className="space-y-3 p-6">
                  {[0, 1, 2, 3].map((key) => (
                    <Skeleton key={key} className="h-12 w-full" />
                  ))}
                </div>
              ) : referrals.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">
                  कोई रेफरल डेटा उपलब्ध नहीं है।
                </div>
              ) : (
                <Table>
                  <TableCaption>
                    कुल {referrals.length} रेफरल रिकॉर्ड दिखाई जा रहे हैं।
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>नाम</TableHead>
                      <TableHead>ईमेल</TableHead>
                      <TableHead>स्थिति</TableHead>
                      <TableHead className="w-[120px]">जॉइनिंग</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((referral, idx) => {
                      const rowKey =
                        referral.id ?? referral.email ?? `referral-${idx}`;
                      return (
                        <TableRow key={rowKey}>
                        <TableCell className="font-medium">
                          {referral.name ? referral.name.charAt(0).toUpperCase() + referral.name.slice(1).toLowerCase() : "N/A"}
                        </TableCell>
                        <TableCell>{referral.email || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            
                              <Badge variant="outline" className="text-green-600">
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky lg:top-24">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                {userImageUrl && <AvatarImage src={userImageUrl} alt={user?.name || "User"} />}
                <AvatarFallback className="text-base font-medium">
                  {displayInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : "User"}
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
          <CardContent className="space-y-4">
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{user?.user_id ?? "N/A"}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                अपनी रेफरल लिंक साझा करें और अधिक सदस्यों को जोड़ें।
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 truncate rounded-md border bg-muted px-3 py-2 text-xs shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]">
                  {referralLink || "रेफरल लिंक उपलब्ध नहीं"}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="shrink-0 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]"
                  disabled={!referralLink || copyState !== 'idle'}
                  onClick={handleCopy}
                  title={
                    copyState === 'success' 
                      ? 'Copied!' 
                      : copyState === 'error' 
                      ? 'Failed to copy' 
                      : 'Copy referral link'
                  }
                >
                  {copyState === 'success' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : copyState === 'error' ? (
                    <X className="h-4 w-4 text-red-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">कुल रेफरल</p>
              <p className="text-2xl font-semibold">{totalReferrals}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatCard;