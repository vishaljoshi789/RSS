"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { User } from "@/types/auth.types";

interface ProfileCompletionModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const isProfileIncomplete = (user: User | null): boolean => {
  if (!user) return false;

  const requiredFields = [
    user.name,
    user.phone,
    user.dob,
    user.gender,
    user.aadhar_number,
    user.street,
    user.city,
    user.state,
    user.postal_code,
  ];

  return requiredFields.some((field) => !field || field.trim() === "");
};

// rssindia.org

export default function ProfileCompletionModal({
  user,
  open,
  onOpenChange,
}: ProfileCompletionModalProps) {
  const router = useRouter();

  const handleCompleteProfile = () => {
    onOpenChange(false);
    router.push("/dashboard/setting");
  };

  const missingFields = [];
  if (!user?.name) missingFields.push("Name");
  if (!user?.phone) missingFields.push("Phone");
  if (!user?.dob) missingFields.push("Date of Birth");
  if (!user?.gender) missingFields.push("Gender");
  if (!user?.aadhar_number) missingFields.push("Aadhar Number");
  if (!user?.street) missingFields.push("Street Address");
  if (!user?.city) missingFields.push("City");
  if (!user?.state) missingFields.push("State");
  if (!user?.postal_code) missingFields.push("Postal Code");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>Complete Your Profile</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Your profile is incomplete. Please complete the following required
            fields to access all features:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium mb-2">Missing Information:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {missingFields.map((field) => (
                <li key={field} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Later
          </Button>
          <Button
            onClick={handleCompleteProfile}
            className="w-full sm:w-auto"
          >
            Complete Profile Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
