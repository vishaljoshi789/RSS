"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Mail, Loader2 } from "lucide-react";
import { User } from "@/types/auth.types";
import { useUpdateCurrentUser } from "@/module/dashboard/users/hooks";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface EmailChangeModalProps {
  user: User | null;
}

export const hasRssIndiaEmail = (user: User | null): boolean => {
  if (!user?.email) return false;
  return user.email.toLowerCase().includes("@rssindia.org");
};

export default function EmailChangeModal({ user }: EmailChangeModalProps) {
  const router = useRouter();
  const { setUserData } = useAuth();
  const { updateCurrentUser, isUpdating } = useUpdateCurrentUser();
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string; confirm?: string }>({});

  const open = hasRssIndiaEmail(user);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: { email?: string; confirm?: string } = {};

    if (!newEmail) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(newEmail)) {
      newErrors.email = "Please enter a valid email address";
    } else if (newEmail.toLowerCase().includes("@rssindia.org")) {
      newErrors.email = "Please use a different domain (not @rssindia.org)";
    }

    if (!confirmEmail) {
      newErrors.confirm = "Please confirm your email";
    } else if (newEmail !== confirmEmail) {
      newErrors.confirm = "Emails do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!user?.id) return;

    // Update email
    const result = await updateCurrentUser(user.id, { email: newEmail });

    if (result.success && result.data) {
      setUserData(result.data);
      toast.success("Email updated successfully! Please verify your new email.");
      
      // Clear form
      setNewEmail("");
      setConfirmEmail("");
      
      // Optionally logout user to verify new email
      // logout();
      // router.push("/auth/login");
    } else {
      toast.error(result.error || "Failed to update email");
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <DialogTitle className="text-xl">Urgent: Email Change Required</DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-base">
            Your current email address uses the <span className="font-semibold text-red-600">@rssindia.org</span> domain, 
            which is no longer supported. Please update your email address immediately to continue using the platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-email" className="text-sm font-medium">
              Current Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="current-email"
                type="email"
                value={user?.email || ""}
                disabled
                className="pl-10 bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-email" className="text-sm font-medium">
              New Email Address <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="new-email"
                type="email"
                placeholder="your.email@example.com"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                disabled={isUpdating}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-email" className="text-sm font-medium">
              Confirm New Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirm-email"
                type="email"
                placeholder="Confirm your new email"
                value={confirmEmail}
                onChange={(e) => {
                  setConfirmEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, confirm: undefined }));
                }}
                className={`pl-10 ${errors.confirm ? "border-red-500" : ""}`}
                disabled={isUpdating}
              />
            </div>
            {errors.confirm && (
              <p className="text-sm text-red-500">{errors.confirm}</p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> After updating your email, you may need to verify 
              the new address. Please ensure you have access to the new email account.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating Email...
              </>
            ) : (
              "Update Email Now"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
