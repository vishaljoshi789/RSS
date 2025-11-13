"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Users, Briefcase, Award, UserCheck } from "lucide-react";
import WingManagement from "./_components/WingManagement";
import LevelManagement from "./_components/LevelManagement";
import PadManagement from "./_components/PadManagement";
// import VolunteerAssignment from "./_components/VolunteerAssignment";
import VolunteerAssignment from "./_components/VolunteerAssignment";
import VolunteerTable from "./_components/volunterManagement";
import { RoleGuard } from "@/components/auth/RoleGuard";


const VolunteerManagement = () => {
  return (
    <RoleGuard allowedRoles="auto" showUnauthorized={true}>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Volunteer Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage volunteer hierarchy, designations, and assignments
          </p>
        </div>
      </div>

      <Tabs defaultValue="wings" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto gap-2 bg-muted p-2">
          <TabsTrigger value="wings" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
            <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Wings</span>
            <span className="sm:hidden">Wings</span>
          </TabsTrigger>
          <TabsTrigger value="levels" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
            <Award className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Levels</span>
            <span className="sm:hidden">Levels</span>
          </TabsTrigger>
          <TabsTrigger value="designations" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
            <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Designations</span>
            <span className="sm:hidden">Pads</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Assignments</span>
            <span className="sm:hidden">Assign</span>
          </TabsTrigger>
          <TabsTrigger value="volunteers" className="gap-1 sm:gap-2 text-xs sm:text-sm py-2 col-span-2 sm:col-span-1">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Volunteers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wings" className="space-y-4">
          <WingManagement />
        </TabsContent>

        <TabsContent value="levels" className="space-y-4">
          <LevelManagement />
        </TabsContent>

        <TabsContent value="designations" className="space-y-4">
          <PadManagement />
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <VolunteerAssignment />
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-4">
          <VolunteerTable />
        </TabsContent>
      </Tabs>

      </div>
    </RoleGuard>
  );
};

export default VolunteerManagement;