"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {Users, Briefcase, Award, UserCheck } from "lucide-react";
import CategoryManagement from "./_components/CategoryManagement";
import LevelManagement from "./_components/LevelManagement";
import PadManagement from "./_components/PadManagement";
import VolunteerAssignment from "./_components/VolunteerAssignment";
import HierarchyTree from "./_components/HierarchyTree";

const VolunteerManagement = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Volunteer Management
          </h1>
          <p className="text-muted-foreground">
            Manage volunteer hierarchy, designations, and assignments
          </p>
        </div>
      </div>

      <Tabs defaultValue="hierarchy" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hierarchy" className="gap-2">
            <Users className="h-4 w-4" />
            Hierarchy View
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="levels" className="gap-2">
            <Award className="h-4 w-4" />
            Levels
          </TabsTrigger>
          <TabsTrigger value="pads" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Pads (Designations)
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-2">
            <Users className="h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="space-y-4">
          <HierarchyTree />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManagement />
        </TabsContent>

        <TabsContent value="levels" className="space-y-4">
          <LevelManagement />
        </TabsContent>

        <TabsContent value="pads" className="space-y-4">
          <PadManagement />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <VolunteerAssignment />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolunteerManagement;