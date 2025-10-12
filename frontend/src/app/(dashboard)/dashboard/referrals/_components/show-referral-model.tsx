"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, User, AlertCircle } from "lucide-react";
import useAxios from "@/hooks/use-axios";
import { ReferralUser, ShowReferralModalProps } from "../referal";



const ShowReferralModal: React.FC<ShowReferralModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  onUserClick,
}) => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      fetchReferrals();
    }
  }, [isOpen, userId]);

  const fetchReferrals = async () => {
    setLoading(true);
    setError(null);
    setReferrals([]);

    try {
      const response = await axios.get(`/admin/referrals/${userId}/`);
      const data = response.data;

      const referralsList = Array.isArray(data.results)
        ? data.results
        : Array.isArray(data.referrals)
        ? data.referrals
        : Array.isArray(data)
        ? data
        : [];

      setReferrals(referralsList);
    } catch (err: any) {
      console.error("Error fetching referrals:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "रेफरल डेटा लोड करने में त्रुटि"
      );
    } finally {
      setLoading(false);
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

  const handleUserClick = (clickedUserId: string) => {
    onUserClick(clickedUserId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {userName} के रेफरल
          </DialogTitle>
          <DialogDescription>
            User ID: <span className="font-mono font-semibold">{userId}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : referrals.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
              <p className="mt-4 text-sm text-muted-foreground">
                कोई रेफरल नहीं मिला
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {referrals.map((referral, idx) => {
                const rowKey = referral.user_id || referral.id || `ref-${idx}`;
                return (
                  <div
                    key={rowKey}
                    className="group flex items-center gap-3 rounded-lg border p-3 transition-all hover:border-primary hover:bg-accent/50 cursor-pointer"
                    onClick={() =>
                      referral.user_id && handleUserClick(referral.user_id)
                    }
                  >
                    <Avatar className="h-12 w-12">
                      {referral.image && (
                        <AvatarImage
                          src={referral.image}
                          alt={referral.name || "User"}
                        />
                      )}
                      <AvatarFallback className="text-sm">
                        {getInitials(referral.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium truncate group-hover:text-primary">
                          {referral.name || "N/A"}
                        </p>
                        {referral.is_verified && (
                          <Badge
                            variant="outline"
                            className="text-xs text-green-600"
                          >
                            ✓
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="font-mono">
                          {referral.user_id || "N/A"}
                        </span>
                      </div>
                    </div>

                    {referral.referral_count !== undefined &&
                      referral.referral_count > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-blue-50 text-blue-700"
                        >
                          <Users className="mr-1 h-3 w-3" />
                          {referral.referral_count}
                        </Badge>
                      )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!loading && referrals.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground text-center">
              किसी भी उपयोगकर्ता पर क्लिक करें उनके रेफरल देखने के लिए
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShowReferralModal;