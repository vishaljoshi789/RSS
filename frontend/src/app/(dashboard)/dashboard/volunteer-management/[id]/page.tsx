"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, User as UserIcon, Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";
import { useUsers, useVolunteers } from "@/module/dashboard/volunteer";
import type { User, VolunteerFormData } from "@/module/dashboard/volunteer";
import { useDebounce } from "@/hooks/use-debounce";

const AssignVolunteerPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get designation info from URL params
  const designationId = parseInt(params.id as string);
  const wingId = parseInt(searchParams.get("wing_id") || "0");
  const levelId = parseInt(searchParams.get("level_id") || "0");

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [designationInfo, setDesignationInfo] = useState<{
    wing_name: string;
    level_name: string;
    designation_title: string;
  } | null>(null);

  const { users, loading } = useUsers(debouncedSearch); 
  const { volunteers, createVolunteer } = useVolunteers();

  // Fetch designation details using compound key
  useEffect(() => {
    const combo = (volunteers || []).find(
      v => v.designation_id === designationId && 
           v.wing_id === wingId && 
           v.level_id === levelId
    );
    if (combo) {
      setDesignationInfo({
        wing_name: combo.wing_name,
        level_name: combo.level_name,
        designation_title: combo.designation_title,
      });
    }
  }, [designationId, wingId, levelId, volunteers]);

  const handleAssign = async () => {
    if (!selectedUserId) return;

    const selectedUser = users.find((u) => u.id === selectedUserId);
    if (!selectedUser) return;

    try {
      setSubmitting(true);
      const formData: VolunteerFormData = {
        user: selectedUserId,
        designation: designationId,
        phone_number: selectedUser.phone,
      };
      await createVolunteer(formData);
      router.push("/dashboard/volunteer-management");
    } catch (error) {
      // Error handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Assign Volunteer</h1>
          {designationInfo ? (
            <p className="text-muted-foreground">
              {designationInfo.wing_name} → {designationInfo.level_name} → {designationInfo.designation_title}
            </p>
          ) : (
            <p className="text-muted-foreground">Loading designation info...</p>
          )}
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, phone, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select User</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <UserIcon className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="font-semibold text-lg mb-1">No users found</h3>
              <p className="text-sm">
                {searchTerm
                  ? `No users match "${searchTerm}"`
                  : "No users available in the system"}
              </p>
            </div>
          ) : (
            <RadioGroup value={selectedUserId?.toString()} onValueChange={(value) => setSelectedUserId(parseInt(value))}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedUserId === user.id ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    {/* Radio Button */}
                    <div className="absolute top-4 right-4">
                      <RadioGroupItem value={user.id.toString()} />
                    </div>

                    {/* User Card Content */}
                    <div className="space-y-3 pr-8">
                      {/* Avatar and Name */}
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.image || ""} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {user.user_id}</p>
                        </div>
                      </div>

                      {/* User Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                        {user.city && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">
                              {user.city}, {user.state}
                            </span>
                          </div>
                        )}
                        {user.dob && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>{calculateAge(user.dob)} years old</span>
                          </div>
                        )}
                        {user.profession && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Briefcase className="h-4 w-4 flex-shrink-0" />
                            <span className="capitalize">{user.profession}</span>
                          </div>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1">
                        {user.is_verified && (
                          <Badge variant="default" className="text-xs">
                            Verified
                          </Badge>
                        )}
                        {user.is_volunteer && (
                          <Badge variant="secondary" className="text-xs">
                            Volunteer
                          </Badge>
                        )}
                        {user.is_member_account && (
                          <Badge variant="outline" className="text-xs">
                            Member
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAssign}
          disabled={!selectedUserId || submitting}
        >
          {submitting ? "Assigning..." : "Assign Volunteer"}
        </Button>
      </div>
    </div>
  );
};

export default AssignVolunteerPage;
