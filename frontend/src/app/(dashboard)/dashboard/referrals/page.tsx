"use client";

import React, { useState } from "react";
import { Search, UserSearch, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import useAxios from "@/hooks/use-axios";
import { format } from "date-fns";
import { toast } from "sonner";

interface User {
  id?: number;
  user_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  is_verified?: boolean;
  is_member_account?: boolean;
  is_admin_account?: boolean;
  is_staff_account?: boolean;
  is_volunteer?: boolean;
  date_joined?: string;
  gender?: string;
  profession?: string;
  dob?: string;
  referred_by?: string | null;
}

interface ReferralItem {
  id?: number | string;
  name?: string;
  email?: string;
  phone?: string;
  image?: string;
  is_verified?: boolean;
  is_member_account?: boolean;
  date_joined?: string;
  gender?: string;
  profession?: string;
}

export default function ReferralsPage() {
  const axios = useAxios();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!userId.trim()) {
      toast.error("कृपया User ID दर्ज करें");
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);
    setReferrals([]);

    try {
      const userResponse = await axios.get(
        `/admin/users?user_id=${userId.trim()}/`
      );

      if (!userResponse.data) {
        setError("इस User ID के साथ कोई उपयोगकर्ता नहीं मिला");
        toast.error("उपयोगकर्ता नहीं मिला");
        setLoading(false);
        return;
      }

      setUserData(userResponse.data);

      const referralResponse = await axios.get(
        `/admin/referrals/${userId.trim()}/`
      );
      const data = referralResponse.data;

      const referralsList = Array.isArray(data.results)
        ? data.results
        : Array.isArray(data.referrals)
        ? data.referrals
        : Array.isArray(data)
        ? data
        : [];

      setReferrals(referralsList);

      if (referralsList.length === 0) {
        toast.info("इस उपयोगकर्ता के लिए कोई रेफरल नहीं मिला");
      } else {
        toast.success(`${referralsList.length} रेफरल मिले`);
      }
    } catch (err: any) {
      console.error("Search error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "उपयोगकर्ता खोजने में त्रुटि हुई";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <UserSearch className="h-8 w-8" />
          Referral Lookup
        </h1>
        <p className="text-muted-foreground">
          किसी भी उपयोगकर्ता की रेफरल जानकारी देखने के लिए उनकी User ID दर्ज
          करें
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User ID से खोजें</CardTitle>
          <CardDescription>उपयोगकर्ता की अद्वितीय ID दर्ज करें</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="User ID दर्ज करें (उदा: a27447fb)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  खोज रहे हैं...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  खोजें
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && !loading && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {(loading || userData) && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left side - Referrals Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                रेफरल सूची
              </CardTitle>
              <CardDescription>
                {loading
                  ? "डेटा लोड हो रहा है..."
                  : `कुल ${referrals.length} रेफरल`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[500px] overflow-x-auto">
                {loading ? (
                  <div className="space-y-3 p-6">
                    {[0, 1, 2, 3, 4].map((key) => (
                      <Skeleton key={key} className="h-12 w-full" />
                    ))}
                  </div>
                ) : referrals.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 mb-3 opacity-20" />
                    <p>कोई रेफरल डेटा उपलब्ध नहीं है</p>
                  </div>
                ) : (
                  <Table>
                    <TableCaption>
                      कुल {referrals.length} रेफरल रिकॉर्ड
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>नाम</TableHead>
                        <TableHead>ईमेल</TableHead>
                        <TableHead>फोन</TableHead>
                        <TableHead>स्थिति</TableHead>
                        <TableHead className="w-[120px]">जॉइनिंग</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referrals.map((referral, idx) => {
                        const rowKey =
                          referral.id ?? referral.email ?? `ref-${idx}`;
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
                              <div className="flex flex-wrap gap-1">
                                {referral.is_verified && (
                                  <Badge
                                    variant="outline"
                                    className="text-green-600"
                                  >
                                    Verified
                                  </Badge>
                                )}
                                {referral.is_member_account && (
                                  <Badge
                                    variant="outline"
                                    className="text-blue-600"
                                  >
                                    Member
                                  </Badge>
                                )}
                                {!referral.is_verified &&
                                  !referral.is_member_account && (
                                    <Badge variant="secondary">Pending</Badge>
                                  )}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
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

          {/* Right side - User Profile Card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>उपयोगकर्ता विवरण</CardTitle>
                <CardDescription>खोजे गए उपयोगकर्ता की जानकारी</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : userData ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        {userData.image && (
                          <AvatarImage
                            src={userData.image}
                            alt={userData.name}
                          />
                        )}
                        <AvatarFallback className="text-lg font-medium">
                          {getInitials(userData.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {userData.name || "Unknown"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {userData.email || "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {userData.is_verified && (
                        <Badge variant="outline" className="text-green-600">
                          Verified
                        </Badge>
                      )}
                      {userData.is_member_account && (
                        <Badge variant="outline" className="text-blue-600">
                          Member
                        </Badge>
                      )}
                      {userData.is_admin_account && (
                        <Badge variant="outline" className="text-red-600">
                          Admin
                        </Badge>
                      )}
                      {userData.is_staff_account && (
                        <Badge variant="outline" className="text-purple-600">
                          Staff
                        </Badge>
                      )}
                      {userData.is_volunteer && (
                        <Badge variant="outline" className="text-orange-600">
                          Volunteer
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">User ID</p>
                        <p className="font-mono text-sm font-medium">
                          {userData.user_id || "N/A"}
                        </p>
                      </div>

                      {userData.phone && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">फोन</p>
                          <p className="text-sm">{userData.phone}</p>
                        </div>
                      )}

                      {userData.gender && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">लिंग</p>
                          <p className="text-sm capitalize">
                            {userData.gender}
                          </p>
                        </div>
                      )}

                      {userData.profession && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">पेशा</p>
                          <p className="text-sm">{userData.profession}</p>
                        </div>
                      )}

                      {userData.dob && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            जन्म तिथि
                          </p>
                          <p className="text-sm">
                            {format(new Date(userData.dob), "dd MMMM yyyy")}
                          </p>
                        </div>
                      )}

                      {userData.date_joined && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            जॉइनिंग डेट
                          </p>
                          <p className="text-sm">
                            {format(
                              new Date(userData.date_joined),
                              "dd MMM yyyy"
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">कुल रेफरल</p>
                          <p className="text-xs text-muted-foreground">
                            इस उपयोगकर्ता द्वारा रेफर किए गए
                          </p>
                        </div>
                        <div className="text-3xl font-bold text-primary">
                          {referrals.length}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    <UserSearch className="mx-auto h-12 w-12 mb-3 opacity-20" />
                    <p>उपयोगकर्ता खोजने के लिए User ID दर्ज करें</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
