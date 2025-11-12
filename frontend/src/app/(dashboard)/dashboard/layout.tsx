"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import useAxios from "@/hooks/use-axios";
import { useAuth } from "@/hooks/use-auth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const axiosInstance = useAxios();
  const { user , setUserData } = useAuth();

  console.log(user);
  const pathname = usePathname();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/dashboard/");
        
        if (response.data && response.data.user_info) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Dashboard API Error:", error);
        const storedData = localStorage.getItem('user_data');
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            if (parsedData.user_info) {
              setUserData(parsedData);
            }
          } catch (parseError) {
            console.error("Error parsing stored data:", parseError);
          }
        }
      }
    };

    fetchDashboardData();
  }, [axiosInstance, setUserData]);

  const breadcrumbItems = useMemo(() => {
    const pathSegments = pathname.split("/").filter((segment) => segment);

    const labelMap: Record<string, string> = {
      dashboard: "Dashboard",
      users: "Users",
      donations: "Donations",
      members: "Members",
      events: "Events",
      settings: "Settings",
      vyapari: "Vyapari Management",
      referrals: "Referrals",
      payments: "Payments",
      complaints: "Complaints",
      volunteers: "Volunteers",
      "id-cards": "ID Cards",
    };

    return pathSegments.map((segment, index) => {
      const href = "/" + pathSegments.slice(0, index + 1).join("/");
      const label =
        labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const isLast = index === pathSegments.length - 1;

      return {
        href,
        label,
        isLast,
      };
    });
  }, [pathname]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.href}>
                    {index > 0 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                    <BreadcrumbItem
                      className={index === 0 ? "hidden md:block" : ""}
                    >
                      {item.isLast ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.href}>
                          {item.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-3">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
