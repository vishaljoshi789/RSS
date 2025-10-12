"use client";

import React from "react";
import { UserSearch, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { User, UserProfileCardProps } from "../referal";


export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  userData,
  loading,
  referralsCount,
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

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return undefined;
    if (imagePath.startsWith("http")) return imagePath;
    return `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}${imagePath}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>उपयोगकर्ता प्रोफ़ाइल</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>उपयोगकर्ता प्रोफ़ाइल</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-sm text-muted-foreground">
            <UserSearch className="mx-auto h-12 w-12 mb-3 opacity-20" />
            <p>उपयोगकर्ता खोजने के लिए User ID दर्ज करें</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>उपयोगकर्ता प्रोफ़ाइल</CardTitle>
        <CardDescription>संपूर्ण उपयोगकर्ता जानकारी</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Avatar and Name */}
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              {userData.image && (
                <AvatarImage
                  src={getImageUrl(userData.image)}
                  alt={userData.name}
                />
              )}
              <AvatarFallback className="text-2xl">
                {getInitials(userData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold mb-1 truncate">
                {userData.name || "N/A"}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {userData.email}
              </p>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-1">
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
                  <Badge variant="outline" className="text-purple-600">
                    Admin
                  </Badge>
                )}
                {userData.is_staff_account && (
                  <Badge variant="outline" className="text-orange-600">
                    Staff
                  </Badge>
                )}
                {userData.is_volunteer && (
                  <Badge variant="outline" className="text-teal-600">
                    Volunteer
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Referral Count Card */}
          <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  कुल रेफरल
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {userData.referral_count || referralsCount || 0}
                </p>
              </div>
              <Users className="h-12 w-12 text-blue-600 opacity-20" />
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="font-semibold text-sm mb-3">बेसिक जानकारी</h4>

            <div className="grid grid-cols-2 gap-4">
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
                  <p className="text-sm capitalize">{userData.gender}</p>
                </div>
              )}

              {userData.profession && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">पेशा</p>
                  <p className="text-sm capitalize">{userData.profession}</p>
                </div>
              )}

              {userData.dob && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">जन्म तिथि</p>
                  <p className="text-sm">
                    {format(new Date(userData.dob), "dd MMMM yyyy")}
                  </p>
                </div>
              )}

              {userData.date_joined && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">जॉइनिंग डेट</p>
                  <p className="text-sm">
                    {format(new Date(userData.date_joined), "dd MMM yyyy")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address Section */}
          {(userData.city ||
            userData.district ||
            userData.state ||
            userData.postal_code) && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-semibold text-sm mb-3">पता जानकारी</h4>

              <div className="grid grid-cols-2 gap-4">
                {userData.street && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">स्ट्रीट</p>
                    <p className="text-sm">{userData.street}</p>
                  </div>
                )}

                {userData.sub_district && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">उप जिला</p>
                    <p className="text-sm">{userData.sub_district}</p>
                  </div>
                )}

                {userData.city && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">शहर</p>
                    <p className="text-sm capitalize">{userData.city}</p>
                  </div>
                )}

                {userData.district && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">जिला</p>
                    <p className="text-sm capitalize">{userData.district}</p>
                  </div>
                )}

                {userData.state && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">राज्य</p>
                    <p className="text-sm capitalize">{userData.state}</p>
                  </div>
                )}

                {userData.postal_code && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">पिन कोड</p>
                    <p className="text-sm">{userData.postal_code}</p>
                  </div>
                )}

                {userData.country && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">देश</p>
                    <p className="text-sm capitalize">{userData.country}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
