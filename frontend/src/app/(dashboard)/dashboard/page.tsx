"use client";

import React, { useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import Referral from "@/module/dashboard/users/components/referral-model";
import { useReferrals } from "@/module/dashboard/referrals/hooks";
import IDCardManagement from "./id-card-management/page";
import StatCard from "./_components/stat-card";
import useAxios from "@/hooks/use-axios";

export default function Page() {
  const { user } = useAuth();
  const axios = useAxios()
  const {
    referralData,
    loading: referralLoading,
    error: referralError,
  } = useReferrals();

  useEffect(() => {
    const data = async () => {
      const api = await axios.get('/dashboard/referrals');
      console.log(api);
    }
    data();
  },[])


  const referralCount = referralData.total_referrals ?? 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome{user?.name ? `, ${user.name}` : " to Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          Welcome to the Rashtriya Swayamsevak Sangh dashboard. Here you can
          view your activities and information.
        </p>
       
      </div>

      <StatCard
        user={user}
        referralData={referralData}
        loading={referralLoading}
        error={referralError}
      />

      <Referral
        userData={user}
        referralCount={referralLoading ? 0 : referralCount}
      />
    </div>
  );
}
