"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Users } from "lucide-react";
import Member from "./_components/Member";
import VolunteerCard from "./_components/Volunteercards";

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

      <Tabs defaultValue="volunteers" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="volunteers" className="gap-2">
            <Users className="h-4 w-4" />
            Volunteers
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-2">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Member />
        </TabsContent>

        <TabsContent value="volunteers" className="space-y-4">
          <VolunteerCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolunteerManagement;
