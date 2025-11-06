import { DashboardRole } from "@/app/(dashboard)/dashboard/_components/nav-config";

export interface RouteAccess {
  path?: string;
  pattern?: RegExp;
  allowedRoles: DashboardRole[] | "all";
  description: string;
}

export const ROUTE_ACCESS_MAP: RouteAccess[] = [
  {
    path: "/dashboard",
    allowedRoles: "all",
    description: "Dashboard home - accessible to all authenticated users",
  },
  {
    path: "/dashboard/users",
    allowedRoles: ["admin", "staff"],
    description: "User management - admin and staff only",
  },
  {
    path: "/dashboard/payments",
    allowedRoles: ["admin", "staff"],
    description: "Payment management - admin and staff only",
  },
  {
    path: "/dashboard/payments/mannual",
    allowedRoles: ["admin", "staff"],
    description: "Manual payment entry - admin and staff only",
  },
  {
    path: "/dashboard/vyapari",
    allowedRoles: ["admin", "staff"],
    description: "Business directory management - admin and staff only",
  },
  {
    path: "/dashboard/volunteer-management",
    allowedRoles: ["admin", "staff"],
    description: "Volunteer management - admin and staff only",
  },
  {
    path: "/dashboard/referrals",
    allowedRoles: ["admin", "staff"],
    description: "Referral management - admin and staff only",
  },
  {
    path: "/dashboard/shikayat-portal",
    allowedRoles: ["member"],
    description: "Complaint portal - members only",
  },
  {
    path: "/dashboard/id-card-management",
    allowedRoles: ["member", "volunteer"],
    description: "ID card collection - members and volunteers",
  },
  {
    path: "/dashboard/volunteer-registration",
    allowedRoles: ["volunteer", "member"],
    description: "Volunteer registration - volunteers and members",
  },
  {
    path: "/dashboard/volunteer-info",
    allowedRoles: ["volunteer", "member"],
    description: "Volunteer information - volunteers and members",
  },
  {
    pattern: /^\/dashboard\/volunteer-info\/[^/]+$/,
    allowedRoles: ["volunteer", "member"],
    description: "Volunteer detail view - volunteers and members",
  },
];

function findRouteAccess(path: string): RouteAccess | undefined {
  return ROUTE_ACCESS_MAP.find((route) => {
    if (route.path && route.path === path) {
      return true;
    }

    if (route.pattern && route.pattern.test(path)) {
      return true;
    }

    return false;
  });
}

export function getAllowedRolesForRoute(path: string): DashboardRole[] | "all" | null {
  const route = findRouteAccess(path);
  return route ? route.allowedRoles : null;
}


export function canAccessRoute(
  path: string,
  userRoles: DashboardRole[]
): boolean {
  const allowedRoles = getAllowedRolesForRoute(path);
  if (allowedRoles === null) {
    return false;
  }
  
  if (allowedRoles === "all") {
    return true;
  }
  
  return allowedRoles.some((role) => userRoles.includes(role));
}
