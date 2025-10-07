"use client";

import React from "react";
import { User } from "@/types/auth.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  MapPin,
  Shield,
  CheckCircle2,
  XCircle,
  CreditCard,
  IdCard,
} from "lucide-react";

interface UserDetailModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

export function UserDetailModal({
  user,
  open,
  onOpenChange,
  loading = false,
}: UserDetailModalProps) {
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserRole = (): string => {
    if (!user) return "User";
    if (user.is_blocked) return "Blocked";
    if (user.is_admin_account || user.is_superuser) return "Admin";
    if (user.is_staff_account) return "Staff";
    if (user.is_volunteer) return "Volunteer";
    if (user.is_member_account) return "Member";
    return "User";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | undefined;
  }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm">{value || "Not provided"}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Complete information about the user
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
              <p className="text-sm text-muted-foreground">Loading user details...</p>
            </div>
          </div>
        ) : !user ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">No user data available</p>
          </div>
        ) : (
        <div className="space-y-6">
            
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.image ? (
                  <UserIcon className="h-10 w-10" />
                ) : (
                  getInitials(user.name)
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">{user.name}</h3>
                {user.is_verified && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    user.is_blocked
                      ? "destructive"
                      : user.is_admin_account || user.is_superuser
                      ? "destructive"
                      : user.is_staff_account
                      ? "default"
                      : "secondary"
                  }
                >
                  {getUserRole()}
                </Badge>
                {user.is_verified && (
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {user.is_active && (
                  <Badge variant="outline" className="text-green-600">
                    Active
                  </Badge>
                )}
                {!user.is_active && (
                  <Badge variant="outline" className="text-red-600">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </h4>
            <div className="space-y-2">
              <InfoRow icon={Mail} label="Email" value={user.email} />
              <InfoRow icon={Phone} label="Phone" value={user.phone} />
              <InfoRow icon={IdCard} label="User ID" value={user.user_id} />
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <InfoRow
                icon={Calendar}
                label="Date of Birth"
                value={user.dob ? formatDate(user.dob) : undefined}
              />
              <InfoRow
                icon={UserIcon}
                label="Gender"
                value={user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : undefined}
              />
              <InfoRow
                icon={Briefcase}
                label="Profession"
                value={user.profession}
              />
            </div>
          </div>

          {/* Address Information */}
          {(user.street ||
            user.city ||
            user.district ||
            user.state ||
            user.country ||
            user.postal_code) && (
            <>
              <Separator />
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </h4>
                <div className="space-y-1 text-sm">
                  {user.street && <p>{user.street}</p>}
                  {user.sub_district && <p>{user.sub_district}</p>}
                  <p>
                    {[user.district, user.city].filter(Boolean).join(", ")}
                  </p>
                  <p>
                    {[user.state, user.postal_code].filter(Boolean).join(" - ")}
                  </p>
                  {user.country && <p>{user.country}</p>}
                </div>
              </div>
            </>
          )}

          {/* Government IDs */}
          {(user.aadhar_number || user.pan_number) && (
            <>
              <Separator />
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Government IDs
                </h4>
                <div className="space-y-2">
                  {user.aadhar_number && (
                    <InfoRow
                      icon={IdCard}
                      label="Aadhar Number"
                      value={user.aadhar_number}
                    />
                  )}
                  {user.pan_number && (
                    <InfoRow
                      icon={CreditCard}
                      label="PAN Number"
                      value={user.pan_number}
                    />
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Account Status */}
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Status
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {user.is_verified ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                {user.is_active ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center gap-2">
                {user.is_blocked ? (
                  <XCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                <span className="text-sm">
                  {user.is_blocked ? "Blocked" : "Not Blocked"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {user.is_volunteer ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">Volunteer</span>
              </div>
              <div className="flex items-center gap-2">
                {user.is_staff_account || user.is_staff ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">Staff</span>
              </div>
              <div className="flex items-center gap-2">
                {user.is_admin_account || user.is_superuser ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">Admin</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium mb-1">Joined</p>
              <p>{formatDate(user.date_joined)}</p>
            </div>
            {user.last_login && (
              <div>
                <p className="font-medium mb-1">Last Login</p>
                <p>{formatDate(user.last_login)}</p>
              </div>
            )}
          </div>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
