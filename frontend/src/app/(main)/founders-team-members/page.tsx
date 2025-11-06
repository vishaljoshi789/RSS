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
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

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
    <Card className="flex flex-col h-full border rounded-xl bg-card">
      <CardHeader className="text-center pb-4 flex-shrink-0">
        <div className="relative mx-auto mb-4">
          <div className="relative w-24 h-24 md:w-28 md:h-28 mx-auto">
            <div className="w-full h-full rounded-xl overflow-hidden border">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 96px, 112px"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
              />
            </div>
          </div>
          {priority && (
            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-lg p-1.5">
              <Crown className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <CardTitle className="text-lg font-semibold text-foreground leading-snug mb-2">
          {member.name}
        </CardTitle>

        <CardDescription className="text-sm text-primary font-medium">
          {member.position}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 flex-1 flex flex-col px-4 pb-4">
        <div className="space-y-3 flex-1">
          {member.state && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground border px-2.5 py-1.5 rounded-md">
              <MapPin className="w-3.5 h-3.5" />
              <span className="font-medium">{member.state}</span>
            </div>
          )}

          {member.bio && (
            <div className="flex-1 flex items-center bg-muted/30 p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground text-center leading-relaxed line-clamp-3">
                {member.bio}
              </p>
            </div>
          )}
        </div>

        {priority && (
          <div className="mt-4">
            <Badge className="w-full justify-center py-2 text-xs font-medium rounded-lg bg-primary/10 text-primary border-primary/20">
              <User className="w-3.5 h-3.5 mr-1.5" />
              मुख्य नेतृत्व
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background mt-3">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 pt-4">
        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="absolute -top-10 -right-10 w-64 h-64 text-white/5"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M45.1,-55.4C59.6,-45.7,73.4,-32.7,77.9,-17.1C82.4,-1.5,77.6,16.7,68.3,31.3C59,45.9,45.2,56.9,29.8,62.3C14.4,67.7,-2.6,67.5,-18.7,62.6C-34.8,57.7,-50,48.1,-59.7,34.4C-69.4,20.7,-73.6,3,-70.3,-13.2C-67,-29.4,-56.2,-44.1,-42.5,-54C-28.8,-63.9,-12.2,-68.9,2.5,-72C17.2,-75.1,30.6,-65.1,45.1,-55.4Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            className="absolute -bottom-10 -left-10 w-72 h-72 text-white/5"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M39.5,-62.4C51.1,-54.7,60.3,-43.1,66.8,-29.9C73.3,-16.7,77.1,-1.9,75.4,12.3C73.7,26.5,66.5,40.1,56,49.9C45.5,59.7,31.7,65.7,17.3,68.3C2.9,70.9,-12.1,70.1,-25.3,65.1C-38.5,60.1,-50,50.9,-58.4,38.9C-66.8,26.9,-72.1,12.1,-71.9,-2.8C-71.7,-17.7,-66,-32.8,-56.6,-43.7C-47.2,-54.6,-34.1,-61.3,-20.8,-67.1C-7.5,-72.9,5.9,-77.8,18.9,-76.5C31.9,-75.2,27.9,-70.1,39.5,-62.4Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 text-white/3"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,72.9,41.2C64.4,53.4,53,63.3,39.8,69.8C26.6,76.3,11.6,79.4,-3.3,85.2C-18.2,91,-36.4,99.5,-49.2,94.4C-62,89.3,-69.4,70.6,-74.3,53.3C-79.2,36,-81.6,20.1,-80.8,4.7C-80,-10.7,-76,-25.6,-68.9,-38.2C-61.8,-50.8,-51.6,-61.1,-39.3,-69.2C-27,-77.3,-12.6,-83.2,1.9,-86.5C16.4,-89.8,30.6,-83.6,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <Badge className="mb-6 px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Users className="w-3.5 h-3.5 mr-1.5" />
            हमारी टीम
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-sm">
            {pageContent.title}
          </h1>

          <p className="text-base sm:text-lg text-white/95 font-medium mb-3 max-w-3xl mx-auto">
            {pageContent.subtitle}
          </p>

          <p className="text-sm sm:text-base text-white/80 max-w-4xl mx-auto leading-relaxed">
            {pageContent.description}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-8 sm:h-12 text-background"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path
              d="M0,0 C150,80 350,80 600,60 C850,40 1050,40 1200,80 L1200,120 L0,120 Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
        <Tabs defaultValue="founders" className="w-full">
          <div className="flex justify-center mb-10">
            <TabsList className="inline-flex h-11 items-center justify-center rounded-xl bg-muted p-1 border">
              <TabsTrigger
                value="founders"
                className="inline-flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap rounded-lg px-5 py-2 text-sm font-medium"
              >
                <Crown className="w-4 h-4" />
                मुख्य नेतृत्व
              </TabsTrigger>
              <TabsTrigger
                value="state-team"
                className="inline-flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground whitespace-nowrap rounded-lg px-5 py-2 text-sm font-medium"
              >
                <MapPin className="w-4 h-4" />
                राज्य टीम
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="founders" className="space-y-10">
            <div className="text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1">
                <Crown className="w-3.5 h-3.5 mr-1.5" />
                मुख्य नेतृत्व
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 leading-tight">
                {pageContent.foundersSection.title}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
                {pageContent.foundersSection.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {foundersTeam.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  priority={index < 3}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="state-team" className="space-y-10">
            <div className="text-center">
              <Badge variant="outline" className="mb-4 px-3 py-1">
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                राज्य टीम
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 leading-tight">
                {pageContent.stateTeamSection.title}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
                {pageContent.stateTeamSection.subtitle}
              </p>
            </div>

            <div className="flex justify-center mb-10">
              <Card className="p-6 border rounded-xl max-w-4xl w-full">
                <div className="flex items-center justify-center gap-2 mb-5">
                  <Filter className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">
                    राज्य के अनुसार फ़िल्टर करें
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button
                    variant={selectedState === "all" ? "default" : "outline"}
                    size="sm"
                    className="h-auto py-2 px-4 text-sm font-medium"
                    onClick={() => setSelectedState("all")}
                  >
                    सभी राज्य
                  </Button>
                  {uniqueStates.map((state) => (
                    <Button
                      key={state}
                      variant={selectedState === state ? "default" : "outline"}
                      size="sm"
                      className="h-auto py-2 px-4 text-sm font-medium"
                      onClick={() => setSelectedState(state)}
                    >
                      {state}
                    </Button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredStateTeam.map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
            </div>

            {filteredStateTeam.length === 0 && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Users className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    कोई टीम सदस्य नहीं मिला
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    चुने गए राज्य के लिए कोई टीम सदस्य उपलब्ध नहीं है।
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-16 pt-12 border-t">
          {/* Mobile: stacked cards with smaller icons/text for compact display; Desktop: grid with 3 columns */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center px-0">
            <Card className="p-3 sm:p-6 border rounded-xl">
              <CardContent className="pt-0">
                <Crown className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                  {foundersTeam.length}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  मुख्य नेतृत्व
                </p>
              </CardContent>
            </Card>

            <Card className="p-3 sm:p-6 border rounded-xl">
              <CardContent className="pt-0">
                <MapPin className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                  {uniqueStates.length}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  राज्य कवरेज
                </p>
              </CardContent>
            </Card>

            <Card className="p-3 sm:p-6 border rounded-xl">
              <CardContent className="pt-0">
                <Users className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                  {stateTeam.length}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                  राज्य टीम सदस्य
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
