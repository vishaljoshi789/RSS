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
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Vyapari Management
        </h1>
        <p className="text-muted-foreground">
          Manage business directory categories, subcategories, and listings
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="businesses" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span>Businesses</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger
            value="subcategories"
            className="flex items-center gap-2"
          >
            <FolderTree className="h-4 w-4" />
            <span>SubCategories</span>
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
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
