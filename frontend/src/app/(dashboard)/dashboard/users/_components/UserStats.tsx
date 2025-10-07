"use client";

import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Shield, UsersRound, Briefcase, UserX, UserCog } from "lucide-react";
import { useUserStats } from "@/module/dashboard/users/hooks";

export const UserStats = memo(function UserStats() {
  const { stats, loading } = useUserStats();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Failed to load statistics
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsConfig = [
    {
      title: "Total Users",
      value: stats.total_user,
      icon: Users,
      description: "All registered users",
      color: "text-blue-500",
    },
    {
      title: "Verified Users",
      value: stats.verified_user,
      icon: UserCheck,
      description: "Users with verified accounts",
      color: "text-green-500",
    },
    {
      title: "Members",
      value: stats.member_user,
      icon: UsersRound,
      description: "Member accounts",
      color: "text-purple-500",
    },
    {
      title: "Volunteers",
      value: stats.volunteer_user,
      icon: UsersRound,
      description: "Active volunteers",
      color: "text-indigo-500",
    },
    {
      title: "Business Users",
      value: stats.business_user,
      icon: Briefcase,
      description: "Business accounts",
      color: "text-cyan-500",
    },
    {
      title: "Staff Members",
      value: stats.staff_user,
      icon: UserCog,
      description: "Staff accounts",
      color: "text-orange-500",
    },
    {
      title: "Administrators",
      value: stats.admin_user,
      icon: Shield,
      description: "Admin accounts",
      color: "text-red-500",
    },
    {
      title: "Blocked Users",
      value: stats.blocked_user,
      icon: UserX,
      description: "Blocked accounts",
      color: "text-gray-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
});
