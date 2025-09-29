"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  foundersTeam,
  stateTeam,
  getUniqueStates,
  getTeamMembersByState,
  pageContent,
  type TeamMember,
} from "./teamInfo";
import { Users, MapPin, Crown, Filter, User } from "lucide-react";

const FoundersTeamPage = () => {
  const [selectedState, setSelectedState] = useState<string>("all");
  const uniqueStates = getUniqueStates();
  const filteredStateTeam =
    selectedState === "all" ? stateTeam : getTeamMembersByState(selectedState);

  const TeamMemberCard = ({
    member,
    priority = false,
  }: {
    member: TeamMember;
    priority?: boolean;
  }) => (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] flex flex-col h-full ${
        priority
          ? "border-primary/30 shadow-md bg-gradient-to-br from-primary/5 to-secondary/10"
          : "bg-card"
      }`}
    >
      <CardHeader className="text-center pb-4 flex-shrink-0">
        <div className="relative mx-auto mb-4">
          <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto p-2">
            <div className="w-full h-full rounded-full overflow-hidden border-3 border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 96px, 112px"
              />
            </div>
          </div>
          {priority && (
            <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1.5 shadow-lg">
              <Crown className="w-3 h-3" />
            </div>
          )}
        </div>
        <CardTitle className="text-lg font-bold text-foreground leading-tight min-h-[3rem] flex items-center justify-center">
          {member.name}
        </CardTitle>
        <CardDescription className="text-primary font-semibold min-h-[2.5rem] flex items-center justify-center">
          {member.position}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {member.state && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{member.state}</span>
            </div>
          )}

          {member.bio && (
            <>
              <Separator className="my-2" />
              <div className="flex-1 flex items-center">
                <p className="text-sm text-muted-foreground text-center leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-border">
          <Badge
            variant="secondary"
            className={`w-full justify-center p-2 ${
              priority
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            <User className="w-3 h-3 mr-1" />
            {member.category === "founders" ? "Core Leadership" : "State Team"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 to-accent/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-primary/20">
            <Users className="w-4 h-4" />
            Team Members
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {pageContent.title}
          </h1>
          <p className="text-xl text-primary font-semibold mb-4">
            {pageContent.subtitle}
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {pageContent.description}
          </p>
        </div>

        <Tabs defaultValue="founders" className="w-full">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-card p-1 text-muted-foreground border border-border mx-auto mb-8">
            <TabsTrigger
              value="founders"
              className="inline-flex items-center justify-center data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <Crown className="w-4 h-4" />
              Core Leadership
            </TabsTrigger>
            <TabsTrigger
              value="state-team"
              className="inline-flex items-center justify-center data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <MapPin className="w-4 h-4" />
              State Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="founders" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {pageContent.foundersSection.title}
              </h2>
              <p className="text-lg text-primary font-semibold mb-8">
                {pageContent.foundersSection.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {foundersTeam.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  priority={index < 3}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="state-team" className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {pageContent.stateTeamSection.title}
              </h2>
              <p className="text-lg text-primary font-semibold mb-8">
                {pageContent.stateTeamSection.subtitle}
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <Card className="p-4 bg-card/80 backdrop-blur-sm border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">
                    Filter by State:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant={selectedState === "all" ? "default" : "outline"}
                    size="sm"
                    className={`${selectedState === "all" ? "text-secondary" : ""}`}
                    onClick={() => setSelectedState("all")}
                  >
                    All States
                  </Button>
                  {uniqueStates.map((state) => (
                    <Button
                      className={`${selectedState === state ? "text-secondary" : ""}`}
                      key={state}
                      variant={selectedState === state ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedState(state)}
                    >
                      {state}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStateTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>

            {filteredStateTeam.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No team members found
                </h3>
                <p className="text-muted-foreground">
                  No team members found for the selected state.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-16 pt-12 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
              <CardContent className="pt-0">
                <Crown className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-primary">
                  {foundersTeam.length}
                </h3>
                <p className="text-primary/80 font-semibold">Core Leadership</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary/30">
              <CardContent className="pt-0">
                <MapPin className="w-12 h-12 text-secondary-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-secondary-foreground">
                  {uniqueStates.length}
                </h3>
                <p className="text-secondary-foreground/80 font-semibold">
                  States Covered
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
              <CardContent className="pt-0">
                <Users className="w-12 h-12 text-accent-foreground mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-accent-foreground">
                  {stateTeam.length}
                </h3>
                <p className="text-accent-foreground/80 font-semibold">
                  State Team Members
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundersTeamPage;
