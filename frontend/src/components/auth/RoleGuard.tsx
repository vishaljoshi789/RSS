"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { DashboardRole, deriveDashboardRoles } from "@/app/(dashboard)/dashboard/_components/nav-config";
import { getAllowedRolesForRoute } from "@/lib/route-access";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: DashboardRole[] | "all" | "auto";
  fallbackPath?: string;
  showUnauthorized?: boolean;
}

export function RoleGuard({
  children,
  allowedRoles = "auto",
  fallbackPath = "/dashboard",
  showUnauthorized = false,
}: RoleGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const resolvedRoles: DashboardRole[] | "all" | null = allowedRoles === "auto"
      ? getAllowedRolesForRoute(pathname)
      : allowedRoles;

    if (resolvedRoles === null) {
      if (!showUnauthorized) {
        router.push(fallbackPath);
      }
      setIsAuthorized(false);
      return;
    }

    if (resolvedRoles === "all") {
      setIsAuthorized(true);
      return;
    }

    const userRoles = deriveDashboardRoles(user);
    const hasRequiredRole = resolvedRoles.some((role: DashboardRole) => userRoles.includes(role));

    if (!hasRequiredRole) {
      if (!showUnauthorized) {
        router.push(fallbackPath);
      }
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  }, [user, loading, allowedRoles, pathname, router, fallbackPath, showUnauthorized]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAuthorized && showUnauthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-8">
            <svg
              className="mx-auto h-12 w-12 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-red-900 dark:text-red-100">
              Access Denied
            </h2>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </p>
            <button
              onClick={() => router.push(fallbackPath)}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
