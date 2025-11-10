'use client';

import useAxios from '@/hooks/use-axios';
import { User } from '@/types/auth.types';
import React, { useEffect, useState, useCallback } from 'react';
import { Mail, Phone, MapPin, Briefcase, Shield, UserIcon, CheckCircle2, IdCard, Calendar, CreditCard, XCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function UserProfileModel({id} : {id : number | null}) {
    const api = useAxios();
  const [userData, setUserData] = useState<User | null>(null);

  const fetchUserProfile = useCallback(async (userId: number) => {
    const response = await api.get(`/account/detail/${userId}`);
    setUserData(response.data);
  }, [api]);

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
    if (!userData) return "User";
    if (userData.is_blocked) return "Blocked";
    if (userData.is_admin_account || userData.is_superuser) return "Admin";
    if (userData.is_staff_account) return "Staff";
    if (userData.is_volunteer) return "Volunteer";
    if (userData.is_member_account) return "Member";
    return "User";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Icon components from lucide-react created with forwardRef are objects (not functions);
  // previous logic tried to render that object directly, causing "Objects are not valid as a React child".
  // Accept either a React element or a component type and render safely.
  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType | React.ReactElement;
    label: string;
    value: string | undefined;
  }) => {
    let renderedIcon: React.ReactElement;
    if (React.isValidElement(Icon)) {
      const existingClass = (Icon.props as Record<string, unknown>)?.className || '';
      renderedIcon = React.cloneElement(Icon as React.ReactElement<Record<string, unknown>>, {
        className: `${existingClass} h-4 w-4 text-muted-foreground mt-0.5`.trim(),
      });
    } else {
      renderedIcon = React.createElement(Icon as React.ElementType, {
        className: 'h-4 w-4 text-muted-foreground mt-0.5',
      });
    }
    return (
      <div className="flex items-start gap-3 py-2">
        {renderedIcon}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-sm">{value || 'Not provided'}</p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (id) {
      fetchUserProfile(id);
    }
  }, [id, fetchUserProfile]);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const roles: string[] = [];
  if (userData.is_admin_account) roles.push('Admin');
  if (userData.is_volunteer) roles.push('Volunteer');
  if (userData.is_business_account) roles.push('Business');
  if (userData.is_staff_account) roles.push('Staff');
  if (userData.is_member_account) roles.push('Member');
  if (userData.is_field_worker) roles.push('Field Worker');
  if (userData.is_superuser) roles.push('Superuser');

  return (
    <div className="space-y-6">
            
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData.image} alt={userData.name} />
              <AvatarFallback className="text-lg">
                {userData.image ? (
                  <UserIcon className="h-10 w-10" />
                ) : (
                  getInitials(userData.name)
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">{userData.name}</h3>
                {userData.is_verified && (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">@{userData.username}</p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={
                    userData.is_blocked
                      ? "destructive"
                      : userData.is_admin_account || userData.is_superuser
                      ? "destructive"
                      : userData.is_staff_account
                      ? "default"
                      : "secondary"
                  }
                >
                  {getUserRole()}
                </Badge>
                {userData.is_verified && (
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
                {userData.is_active && (
                  <Badge variant="outline" className="text-green-600">
                    Active
                  </Badge>
                )}
                {!userData.is_active && (
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
              <InfoRow icon={Mail} label="Email" value={userData.email} />
              <InfoRow icon={Phone} label="Phone" value={userData.phone} />
              <InfoRow icon={IdCard} label="User ID" value={userData.user_id} />
              {userData.referred_by && (
                <InfoRow icon={UserIcon} label="Referred By" value={userData.referred_by} />
              )}
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
                value={userData.dob ? formatDate(userData.dob) : undefined}
              />
              <InfoRow
                icon={UserIcon}
                label="Gender"
                value={userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : undefined}
              />
              <InfoRow
                icon={Briefcase}
                label="Profession"
                value={userData.profession}
              />
            </div>
          </div>

          {/* Address Information */}
          {(userData.street ||
            userData.city ||
            userData.district ||
            userData.state ||
            userData.country ||
            userData.postal_code) && (
            <>
              <Separator />
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Address
                </h4>
                <div className="space-y-1 text-sm">
                  {userData.street && <p>{userData.street}</p>}
                  {userData.sub_district && <p>{userData.sub_district}</p>}
                  <p>
                    {[userData.district, userData.city].filter(Boolean).join(", ")}
                  </p>
                  <p>
                    {[userData.state, userData.postal_code].filter(Boolean).join(" - ")}
                  </p>
                  {userData.country && <p>{userData.country}</p>}
                </div>
              </div>
            </>
          )}

          {/* Government IDs */}
          {(userData.aadhar_number || userData.pan_number) && (
            <>
              <Separator />
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Government IDs
                </h4>
                <div className="space-y-2">
                  {userData.aadhar_number && (
                    <InfoRow
                      icon={IdCard}
                      label="Aadhar Number"
                      value={userData.aadhar_number}
                    />
                  )}
                  {userData.pan_number && (
                    <InfoRow
                      icon={CreditCard}
                      label="PAN Number"
                      value={userData.pan_number}
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
                {userData.is_verified ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                {userData.is_active ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center gap-2">
                {userData.is_blocked ? (
                  <XCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                <span className="text-sm">
                  {userData.is_blocked ? "Blocked" : "Not Blocked"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {userData.is_volunteer ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">Volunteer</span>
              </div>
              <div className="flex items-center gap-2">
                {userData.is_staff_account || userData.is_staff ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">Staff</span>
              </div>
              <div className="flex items-center gap-2">
                {userData.is_admin_account || userData.is_superuser ? (
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
              <p>{formatDate(userData.date_joined)}</p>
            </div>
            {userData.last_login && (
              <div>
                <p className="font-medium mb-1">Last Login</p>
                <p>{formatDate(userData.last_login)}</p>
              </div>
            )}
          </div>
        </div>
  );
};
