"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronUp, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  DASHBOARD_NAV_ITEMS,
  type NavItemConfig,
  deriveDashboardRoles,
  filterNavItemsForRoles,
} from "./nav-config";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  const roles = React.useMemo(() => deriveDashboardRoles(user), [user]);

  const navItems = React.useMemo<NavItemConfig[]>(
    () => filterNavItemsForRoles(DASHBOARD_NAV_ITEMS, roles),
    [roles]
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (url: string) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className=" text-white flex aspect-square size-10 items-center justify-center rounded-lg p-0">
                  <Image
                    src="/logo/logo.png"
                    alt="RSS Logo"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-sm">RSS</span>
                  <span className="text-xs text-muted-foreground">
                    Dashboard
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {navItems.length === 0 ? (
                <SidebarMenuItem>
                  <SidebarMenuButton className="h-12 cursor-default text-muted-foreground">
                    No navigation available for your role yet.
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                navItems.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`
                        group relative h-12 px-3
                        transition-all duration-200
                        hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
                        ${
                          active
                            ? "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 font-medium shadow-sm"
                            : "text-sidebar-foreground hover:translate-x-0.5"
                        }
                      `}
                    >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 w-full"
                        >
                          <div
                            className={`
                          flex items-center justify-center h-9 w-9 rounded-lg
                          transition-colors duration-200
                          ${
                            active
                              ? "bg-orange-500/20 text-orange-600 dark:bg-orange-500/30"
                              : "bg-sidebar-accent/50 group-hover:bg-sidebar-accent"
                          }
                        `}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium leading-none">
                                {item.title}
                              </span>
                              {item.description && (
                                <span className="text-xs text-muted-foreground mt-1">
                                  {item.description}
                                </span>
                              )}
                            </div>
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="ml-auto text-[10px] px-1.5 py-0 h-5 bg-orange-500/20 text-orange-600 dark:bg-orange-500/30 dark:text-orange-400 border-0"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {mounted ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-orange-500 text-white">
                        {user?.name ? getUserInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.name || "User"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email || "email@example.com"}
                      </span>
                    </div>
                    <ChevronUp className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton size="lg" className="cursor-default">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-orange-500 text-white">
                    {user?.name ? getUserInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.name || "User"}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || "email@example.com"}
                  </span>
                </div>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
