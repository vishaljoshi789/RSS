import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CreditCard,
  Home,
  Users,
  Store,
  MessageSquareWarning,
  UsersRound,
  IdCard,
  UserPlus,
} from "lucide-react";

import type { User } from "@/types/auth.types";

export type DashboardRole =
  | "guest"
  | "admin"
  | "staff"
  | "volunteer"
  | "member"
  | "audience";

export interface NavItemConfig {
  title: string;
  url: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  roles?: DashboardRole[] | "all";
}

interface RoleDefinition {
  role: DashboardRole;
  flags?: Array<keyof User>;
  predicate?: (user: User) => boolean;
}

export const DASHBOARD_ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: "admin",
    flags: ["is_admin_account", "is_superuser"],
  },
  {
    role: "staff",
    flags: ["is_staff_account", "is_staff"],
  },
  {
    role: "volunteer",
    flags: ["is_volunteer"],
  },
  {
    role: "member",
    flags: ["is_member_account"],
  },
];

export const DASHBOARD_NAV_ITEMS: NavItemConfig[] = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    description: "Overview & Analytics",
    roles: "all",
  },
  {
    title: "Payment",
    url: "/dashboard/payments",
    icon: CreditCard,
    description: "Manage payments",
    badge: "New",
    roles: ["admin", "staff"],
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
    description: "User management",
    roles: ["admin", "staff"],
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: Calendar,
    description: "Event planning",
    roles: ["admin", "staff", "volunteer"],
  },
  {
    title: "Vayapari",
    url: "/dashboard/vyapari",
    icon: Store,
    description: "Business directory",
    roles: ["staff" , "admin"],
  },
  {
    title: "Shikayat Portal",
    url: "/dashboard/shikayat-portal",
    icon: MessageSquareWarning,
    description: "Complaint management",
    roles: ["member"],
  },
  {
    title: "Volunteer Management",
    url: "/dashboard/volunteer-management",
    icon: UsersRound,
    description: "Manage volunteers",
    roles: ["member"],
  },
  {
    title: "ID Card Management",
    url: "/dashboard/id-card-management",
    icon: IdCard,
    description: "Manage ID cards",
    roles: ["member"],
  },
  {
    title: "Referral",
    url: "/dashboard/referrals",
    icon: UserPlus,
    description: "Manage referrals",
    roles: ["admin", "staff"],
  },
];

export const deriveDashboardRoles = (user: User | null): DashboardRole[] => {
  const roles: Set<DashboardRole> = new Set(["audience"]);

  if (!user) {
    return Array.from(roles);
  }

  DASHBOARD_ROLE_DEFINITIONS.forEach(({ role, flags, predicate }) => {
    if (roles.has(role)) return;

    const matchesFlag = flags?.some((flag) => Boolean(user[flag]));
    const matchesPredicate = predicate ? predicate(user) : false;

    if (matchesFlag || matchesPredicate) {
      roles.add(role);
    }
  });

  if (
    !roles.has("admin") &&
    !roles.has("staff") &&
    !roles.has("volunteer") &&
    !roles.has("member")
  ) {
    roles.add("audience");
  }

  return Array.from(roles);
};

export const filterNavItemsForRoles = (
  items: NavItemConfig[],
  roles: DashboardRole[]
): NavItemConfig[] => {
  const roleSet = new Set(roles);

  return items.filter((item) => {
    if (!item.roles || item.roles === "all") {
      return true;
    }

    return item.roles.some((role) => roleSet.has(role));
  });
};