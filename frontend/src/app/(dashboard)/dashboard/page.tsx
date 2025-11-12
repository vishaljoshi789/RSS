"use client";

import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/use-auth";
import { useReferrals } from "@/module/dashboard/referrals/hooks";
// import IDCardManagement from "./id-card-management/page";
import StatCard from "./_components/stat-card";
import UserTransactionHistory from "@/module/dashboard/Payments/components/transaction-history";
import useAxios from "@/hooks/use-axios";
import Link from "next/link";
import ProfileCompletionModal, {
  isProfileIncomplete,
} from "./_components/profile-completion-modal";
import EmailChangeModal, {
  hasRssIndiaEmail,
} from "./_components/email-change-modal";

export default function Page() {
  const { user } = useAuth();
  const axios = useAxios();
  const {
    referralData,
    loading: referralLoading,
    error: referralError,
  } = useReferrals();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const data = async () => {
      try {
        await axios.get("/dashboard/referrals");
      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };
    data();
  }, [axios]);

  useEffect(() => {
    if (user && !hasRssIndiaEmail(user) && isProfileIncomplete(user)) {
      setShowProfileModal(true);
    }
  }, [user]);

  return (
    <>
      {/* Email change modal - takes priority over profile completion */}
      <EmailChangeModal user={user} />
      
      <ProfileCompletionModal
        user={user}
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />

      <div className="space-y-2 sm:space-y-6 sm:p-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome
              {user?.name
                ? `, ${
                    user.name.charAt(0).toUpperCase() +
                    user.name.slice(1).toLowerCase()
                  }`
                : " to Dashboard"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Welcome to the RASHTRIYA SEVA SANGH dashboard. Here you can
              view your activities and information.
            </p>
          </div>

          {!user?.is_member_account && (
            <div className="flex gap-2">
              <Link
                href="/become-member"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Become Member
              </Link>
            </div>
          )}
        </div>

      <StatCard
        user={user}
        referralData={referralData}
        loading={referralLoading}
        error={referralError}
      />

      <div className="grid grid-cols-1  gap-6">
        <UserTransactionHistory />

        {/* <Referral
          userData={user}
          referralCount={referralLoading ? 0 : referralCount}
        /> */}
      </div>
    </div>
    </>
  );
}
