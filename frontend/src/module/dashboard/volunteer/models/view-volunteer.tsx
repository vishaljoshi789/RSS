"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User as UserIcon,
  Shield,
  FileText,
} from 'lucide-react'
import Link from 'next/link'
import { VolunteerWithUser } from '../types'

interface ViewVolunteerModalProps {
  volunteer: VolunteerWithUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewVolunteerModal({
  volunteer,
  open,
  onOpenChange,
}: ViewVolunteerModalProps) {
  if (!volunteer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Volunteer Details</DialogTitle>
          <DialogDescription>
            Complete information about the volunteer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-start gap-6 p-6 bg-muted/50 rounded-lg">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage
                src={volunteer.user.image ?? ''}
                alt={volunteer.user.name ?? 'volunteer'}
              />
              <AvatarFallback className="text-2xl">
                {(volunteer.user.name || volunteer.user.username || 'V')
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <h3 className="text-2xl font-bold">{volunteer.user.name}</h3>
              <p className="text-muted-foreground">@{volunteer.user.username}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {volunteer.user.is_verified && (
                  <Badge variant="default" className="bg-green-500">
                    Verified
                  </Badge>
                )}
                {volunteer.user.is_admin_account && (
                  <Badge variant="destructive">Admin</Badge>
                )}
                {volunteer.user.is_volunteer && (
                  <Badge variant="outline">Volunteer</Badge>
                )}
                {volunteer.user.is_member_account && (
                  <Badge variant="secondary">Member</Badge>
                )}
                {volunteer.user.is_business_account && (
                  <Badge variant="outline">Business</Badge>
                )}
                {volunteer.user.is_staff_account && <Badge>Staff</Badge>}
                {volunteer.user.is_field_worker && (
                  <Badge variant="outline">Field Worker</Badge>
                )}
                {volunteer.user.is_blocked && (
                  <Badge variant="destructive">Blocked</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Shield className="h-4 w-4" />
                Wing
              </div>
              <p className="text-lg font-medium">{volunteer.wing_name || '—'}</p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Shield className="h-4 w-4" />
                Level
              </div>
              <p className="text-lg font-medium">{volunteer.level_name || '—'}</p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Shield className="h-4 w-4" />
                Designation
              </div>
              <p className="text-lg font-medium">
                {volunteer.designation_title || '—'}
              </p>
            </div>
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined Date
              </div>
              <p className="text-lg font-medium">
                {volunteer.joined_date
                  ? new Date(volunteer.joined_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : '—'}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Contact Information</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${volunteer.user.email}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {volunteer.user.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${volunteer.phone_number || volunteer.user.phone}`}
                    className="font-medium hover:text-blue-600"
                  >
                    {volunteer.phone_number || volunteer.user.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {volunteer.user.user_id && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium">{volunteer.user.user_id}</p>
                </div>
              )}
              {volunteer.user.dob && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {new Date(volunteer.user.dob).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
              {volunteer.user.gender && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{volunteer.user.gender}</p>
                </div>
              )}
              {volunteer.user.profession && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Profession</p>
                  <p className="font-medium capitalize">
                    {volunteer.user.profession}
                  </p>
                </div>
              )}
              {volunteer.user.aadhar_number && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">Aadhar Number</p>
                  <p className="font-medium">{volunteer.user.aadhar_number}</p>
                </div>
              )}
              {volunteer.user.pan_number && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">PAN Number</p>
                  <p className="font-medium uppercase">
                    {volunteer.user.pan_number}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </h4>
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              {volunteer.user.street && (
                <p className="text-sm">
                  <span className="font-medium">Street:</span> {volunteer.user.street}
                </p>
              )}
              {volunteer.user.sub_district && (
                <p className="text-sm">
                  <span className="font-medium">Sub District:</span>{' '}
                  {volunteer.user.sub_district}
                </p>
              )}
              {volunteer.user.district && (
                <p className="text-sm">
                  <span className="font-medium">District:</span>{' '}
                  {volunteer.user.district}
                </p>
              )}
              {volunteer.user.city && (
                <p className="text-sm">
                  <span className="font-medium">City:</span> {volunteer.user.city}
                </p>
              )}
              {volunteer.user.state && (
                <p className="text-sm">
                  <span className="font-medium">State:</span> {volunteer.user.state}
                </p>
              )}
              {volunteer.user.country && (
                <p className="text-sm">
                  <span className="font-medium">Country:</span> {volunteer.user.country}
                </p>
              )}
              {volunteer.user.postal_code && (
                <p className="text-sm">
                  <span className="font-medium">Postal Code:</span>{' '}
                  {volunteer.user.postal_code}
                </p>
              )}
              {!volunteer.user.street &&
                !volunteer.user.sub_district &&
                !volunteer.user.district &&
                !volunteer.user.city &&
                !volunteer.user.state && (
                  <p className="text-muted-foreground">
                    No address information available
                  </p>
                )}
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Documents</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {volunteer.affidavit ? (
                <a
                  href={volunteer.affidavit}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Affidavit</p>
                    <p className="text-sm text-muted-foreground">Click to view</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-muted-foreground">Affidavit</p>
                    <p className="text-sm text-muted-foreground">Not available</p>
                  </div>
                </div>
              )}
              {volunteer.aadhar_card_front ? (
                <a
                  href={volunteer.aadhar_card_front}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Aadhar Card (Front)</p>
                    <p className="text-sm text-muted-foreground">Click to view</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Aadhar Card (Front)
                    </p>
                    <p className="text-sm text-muted-foreground">Not available</p>
                  </div>
                </div>
              )}
              {volunteer.aadhar_card_back ? (
                <a
                  href={volunteer.aadhar_card_back}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Aadhar Card (Back)</p>
                    <p className="text-sm text-muted-foreground">Click to view</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-muted-foreground">
                      Aadhar Card (Back)
                    </p>
                    <p className="text-sm text-muted-foreground">Not available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Details */}
          {(volunteer.user.date_joined || volunteer.user.last_login) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Account Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {volunteer.user.date_joined && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Date Joined</p>
                    <p className="font-medium">
                      {new Date(volunteer.user.date_joined).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                )}
                {volunteer.user.last_login && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="font-medium">
                      {new Date(volunteer.user.last_login).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          {volunteer.can_view_member_data && (
            <div className="pt-4 border-t">
              <Link href={`/dashboard/volunteer-info/${volunteer.id}`}>
                <Button className="w-full" size="lg">
                  <UserIcon className="h-4 w-4 mr-2" />
                  View Full Member Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
