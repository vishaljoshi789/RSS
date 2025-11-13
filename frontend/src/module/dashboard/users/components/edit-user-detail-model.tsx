"use client";

import React, { useEffect, useState } from "react";
import { User } from "@/types/auth.types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import useAxios from "@/hooks/use-axios";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  CreditCard,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  profession: z.string().optional(),

  // Address fields
  street: z.string().optional(),
  sub_district: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),

  // Government IDs
  aadhar_number: z.string().optional(),
  pan_number: z.string().optional(),

  // Account status
  is_active: z.boolean(),
  is_verified: z.boolean(),
  is_blocked: z.boolean(),

  // Roles
  is_volunteer: z.boolean(),
  is_staff_account: z.boolean(),
  is_field_worker: z.boolean(),
  is_admin_account: z.boolean(),
  is_member_account: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserDetailModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userId: number, data: Partial<User>) => Promise<void>;
  loading?: boolean;
}

export function EditUserDetailModal({
  user,
  open,
  onOpenChange,
  onSave,
  loading = false,
}: EditUserDetailModalProps) {
  const axios = useAxios();
  const { isAdmin, isStaff } = useAuth();
  const restrictRoles = isStaff() && !isAdmin();
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingVerificationValue, setPendingVerificationValue] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      profession: "",
      street: "",
      sub_district: "",
      district: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
      aadhar_number: "",
      pan_number: "",
      is_active: true,
      is_verified: false,
      is_blocked: false,
      is_volunteer: false,
      is_staff_account: false,
      is_field_worker: false,
      is_admin_account: false,
      is_member_account: false,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        profession: user.profession || "",
        street: user.street || "",
        sub_district: user.sub_district || "",
        district: user.district || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        postal_code: user.postal_code || "",
        aadhar_number: user.aadhar_number || "",
        pan_number: user.pan_number || "",
        is_active: user.is_active,
        is_verified: user.is_verified,
        is_blocked: user.is_blocked,
        is_volunteer: user.is_volunteer,
        is_staff_account: user.is_staff_account,
        is_field_worker: user.is_field_worker,
        is_admin_account: user.is_admin_account,
        is_member_account: user.is_member_account,
      });
    }
  }, [user, form]);

  const handleVerificationChange = (checked: boolean) => {
    if (checked && !user?.is_verified) {
      setPendingVerificationValue(true);
      setShowVerifyDialog(true);
    } else if (!checked && user?.is_verified) {
      setPendingVerificationValue(false);
      setShowVerifyDialog(true);
    } else {
      form.setValue("is_verified", checked);
    }
  };

  const handleVerifyConfirm = async () => {
    if (!user) return;
    
    try {
      setIsVerifying(true);
      
      await axios.post(`/account/verify/${user.id}/`);
      
      form.setValue("is_verified", pendingVerificationValue);
      
      toast.success(
        pendingVerificationValue
          ? "User verified successfully!"
          : "User verification removed successfully!"
      );
      
      setShowVerifyDialog(false);
    } catch (error: unknown) {
      console.error("Error verifying user:", error);
      const axiosError = error as { response?: { data?: { message?: string; error?: string } } };
      toast.error(
        axiosError?.response?.data?.message ||
        axiosError?.response?.data?.error ||
        "Failed to update verification status"
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyCancel = () => {
    setShowVerifyDialog(false);
    // Revert to current value
    if (user) {
      form.setValue("is_verified", user.is_verified);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    let payload: Partial<User> = { ...data } as unknown as Partial<User>;
    if (restrictRoles) {
      // Staff users can only modify volunteer and member: omit elevated role fields
      const rest: Partial<User> = { ...payload };
      delete rest.is_admin_account;
      delete rest.is_staff_account;
      delete rest.is_field_worker;
      payload = rest;
    }
    await onSave(user.id, payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Edit User Profile</DialogTitle>
              <DialogDescription>
                Update user information, roles, and account status
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 py-4"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <Badge variant="outline" className="ml-auto">
                    Required
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          Full Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter full name"
                            {...field}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter email"
                            type="email"
                            {...field}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter phone number"
                            {...field}
                            className="h-10"
                            minLength={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Profession
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter profession"
                            {...field}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  <Badge variant="secondary" className="ml-auto">
                    Optional
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter street address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sub_district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub District</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter sub district" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter district" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Government IDs</h3>
                  <Badge variant="secondary" className="ml-auto">
                    Optional
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <FormField
                    control={form.control}
                    name="aadhar_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Aadhar Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="XXXX-XXXX-XXXX"
                            {...field}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pan_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          PAN Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ABCDE1234F"
                            {...field}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">
                    User Roles & Permissions
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <FormField
                    control={form.control}
                    name="is_volunteer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900 p-4 hover:shadow-sm transition-shadow">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Volunteer
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Can participate as a volunteer
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_member_account"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900 p-4 hover:shadow-sm transition-shadow">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Member
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Regular member account
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!restrictRoles && (
                    <FormField
                      control={form.control}
                      name="is_staff_account"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-900 p-4 hover:shadow-sm transition-shadow">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              Staff
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Elevated privileges
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}

                  {!restrictRoles && (
                    <FormField
                      control={form.control}
                      name="is_field_worker"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-teal-200 bg-teal-50/50 dark:bg-teal-950/20 dark:border-teal-900 p-4 hover:shadow-sm transition-shadow">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              Field Worker
                            </FormLabel>
                            <FormDescription className="text-xs">
                              On-ground operations support
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}

                  {!restrictRoles && (
                    <FormField
                      control={form.control}
                      name="is_admin_account"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900 p-4 hover:shadow-sm transition-shadow">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              Administrator
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Full system access
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Account Status</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border-2 border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-800 p-4 hover:shadow-md transition-all">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5 data-[state=checked]:bg-green-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Active
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Account is active
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_verified"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border-2 border-blue-300 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 p-4 hover:shadow-md transition-all">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={handleVerificationChange}
                            className="mt-0.5 data-[state=checked]:bg-blue-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-semibold flex items-center gap-1">
                            <Shield className="h-4 w-4 text-blue-600" />
                            Verified
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Identity verified (requires confirmation)
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_blocked"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border-2 border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 p-4 hover:shadow-md transition-all">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5 data-[state=checked]:bg-red-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-semibold flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-600" />
                            Blocked
                          </FormLabel>
                          <FormDescription className="text-xs text-red-600 dark:text-red-400">
                            Block this user
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <div className="border-t pt-4 mt-2">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Changes will be saved immediately
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                onClick={form.handleSubmit(onSubmit)}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      
      <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              {pendingVerificationValue ? "Verify User" : "Remove Verification"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingVerificationValue ? (
                <>
                  Are you sure you want to verify <strong>{user?.name}</strong>?
                  <br />
                  <br />
                  <span className="text-sm">
                    This will mark the user&apos;s identity as verified and may grant them
                    additional privileges on the platform.
                  </span>
                </>
              ) : (
                <>
                  Are you sure you want to remove verification status from{" "}
                  <strong>{user?.name}</strong>?
                  <br />
                  <br />
                  <span className="text-sm">
                    This will mark the user as unverified and may restrict some features.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleVerifyCancel} disabled={isVerifying}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleVerifyConfirm}
              disabled={isVerifying}
              className={
                pendingVerificationValue
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {pendingVerificationValue ? "Verify User" : "Remove Verification"}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}

export default EditUserDetailModal;
