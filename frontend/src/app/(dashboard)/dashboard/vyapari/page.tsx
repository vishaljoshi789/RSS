"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Layers, FolderTree, Megaphone } from "lucide-react";
import CategoryManagement from "./_components/category-management";
import SubCategoryManagement from "./_components/subcategory-management";
import VyapariManagement from "./_components/vyapari-management";
import AdsManagement from "./_components/ads-management";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function VyapariDashboardPage() {
  const [activeTab, setActiveTab] = useState("businesses");

  return (
    <RoleGuard allowedRoles="auto" showUnauthorized={true}>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Vyapari Management
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage business directory categories, subcategories, and listings
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4 sm:space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1">
          <TabsTrigger value="businesses" className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm">
            <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">Businesses</span>
            <span className="xs:hidden sm:hidden">Biz</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm">
            <Layers className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">Categories</span>
            <span className="xs:hidden sm:hidden">Cat</span>
          </TabsTrigger>
          <TabsTrigger
            value="subcategories"
            className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm"
          >
            <FolderTree className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline sm:inline">SubCategories</span>
            <span className="xs:hidden sm:hidden">Sub</span>
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm">
            <Megaphone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Ads</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="businesses" className="space-y-4">
          <VyapariManagement />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="subcategories" className="space-y-4">
          <SubCategoryManagement />
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          <AdsManagement />
        </TabsContent>
      </Tabs>
      </div>
    </RoleGuard>
  );
}
