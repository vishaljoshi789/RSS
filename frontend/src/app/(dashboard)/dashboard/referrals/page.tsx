"use client";

import React, { useState } from "react";
import { UserSearch } from "lucide-react";
import { toast } from "sonner";
import useAxios from "@/hooks/use-axios";
import {
  SearchBar,
  UserProfileCard,
  ReferralsTable,
  ShowReferralModal,
} from "./_components";
import { User, ReferralItem } from "./referal";

export default function ReferralsPage() {
  const axios = useAxios();
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");

  const handleSearch = async () => {
    if (!userId.trim()) {
      toast.error("कृपया User ID दर्ज करें");
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);
    setReferrals([]);

    try {
      const userResponse = await axios.get(
        `/admin/users?user_id=${userId.trim()}`
      );

      if (
        !userResponse.data ||
        !userResponse.data.results ||
        userResponse.data.results.length === 0
      ) {
        setError("इस User ID के साथ कोई उपयोगकर्ता नहीं मिला");
        toast.error("उपयोगकर्ता नहीं मिला");
        setLoading(false);
        return;
      }

      const user = userResponse.data.results[0];
      setUserData(user);

      const referralResponse = await axios.get(
        `/admin/referrals/${userId.trim()}/`
      );
      const data = referralResponse.data;

      const referralsList = Array.isArray(data.results)
        ? data.results
        : Array.isArray(data.referrals)
        ? data.referrals
        : Array.isArray(data)
        ? data
        : [];

      setReferrals(referralsList);

      if (referralsList.length === 0) {
        toast.info("इस उपयोगकर्ता के लिए कोई रेफरल नहीं मिला");
      } else {
        toast.success(`${referralsList.length} रेफरल मिले`);
      }
    } catch (err: any) {
      console.error("Search error:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "उपयोगकर्ता खोजने में त्रुटि हुई";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleReferralClick = (referralUserId: string, referralName: string) => {
    setSelectedUserId(referralUserId);
    setSelectedUserName(referralName);
    setModalOpen(true);
  };

  const handleModalUserClick = (clickedUserId: string) => {
    setUserId(clickedUserId);
    setModalOpen(false);
    // Trigger search after modal closes
    setTimeout(() => {
      const searchButton = document.querySelector(
        "[data-search-button]"
      ) as HTMLButtonElement;
      if (searchButton) {
        searchButton.click();
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <UserSearch className="h-8 w-8" />
          Referral Lookup
        </h1>
        <p className="text-muted-foreground">
          किसी भी उपयोगकर्ता की रेफरल जानकारी देखने के लिए उनकी User ID दर्ज करें
        </p>
      </div>

      {/* Search Bar Component */}
      <SearchBar
        userId={userId}
        loading={loading}
        onUserIdChange={setUserId}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
      />

      {/* Main Content Grid */}
      {(loading || userData) && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left side - Referrals Table Component */}
          <ReferralsTable
            referrals={referrals}
            loading={loading}
            error={error}
            onReferralClick={handleReferralClick}
          />

          {/* Right side - User Profile Card Component */}
          <UserProfileCard
            userData={userData}
            loading={loading}
            referralsCount={referrals.length}
          />
        </div>
      )}

      {/* Referral Modal Component */}
      <ShowReferralModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={selectedUserId}
        userName={selectedUserName}
        onUserClick={handleModalUserClick}
      />
    </div>
  );
}
