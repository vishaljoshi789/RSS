"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  foundersTeam,
  stateTeam,
  getUniqueStates,
  getTeamMembersByState,
  pageContent,
  type TeamMember,
} from "./teamInfo";
import { Users, MapPin, Crown, Filter } from "lucide-react";
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
    <div className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden ">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Crown Icon for Priority Members */}
        {priority && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
            <Crown className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">
          {member.name}
        </h3>
        
        <p className="text-sm text-muted-foreground font-medium mb-3">
          {member.position}
        </p>

        {member.state && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span>{member.state}</span>
          </div>
        )}

        {member.bio && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {member.bio}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background lg:mt-0 mt-10">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-12 sm:py-16 lg:py-20">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_var(--primary-foreground)_0%,_transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_var(--primary-foreground)_0%,_transparent_50%)]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4 lg:mb-6 border border-primary-foreground/20">
            <Users className="w-4 h-4" />
            हमारी टीम
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 lg:mb-4 leading-tight">
            {pageContent.title}
          </h1>

          <p className="text-base sm:text-lg text-primary-foreground/90 font-medium mb-2 max-w-3xl mx-auto">
            {pageContent.subtitle}
          </p>

          <p className="text-sm sm:text-base text-primary-foreground/80 max-w-4xl mx-auto leading-relaxed">
            {pageContent.description}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16 lg:py-20">
        <Tabs defaultValue="founders" className="w-full">
          <div className="flex justify-center mb-10 lg:mb-12">
            <TabsList className="inline-flex h-auto items-center justify-center rounded-xl bg-muted p-1.5 border shadow-sm">
              <TabsTrigger
                value="founders"
                className="inline-flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-semibold transition-all"
              >
                <Crown className="w-4 h-4" />
                मुख्य नेतृत्व
              </TabsTrigger>
              <TabsTrigger
                value="state-team"
                className="inline-flex items-center justify-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-semibold transition-all"
              >
                <MapPin className="w-4 h-4" />
                राज्य टीम
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="founders" className="space-y-8 lg:space-y-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4 lg:mb-6">
                <Crown className="w-4 h-4" />
                मुख्य नेतृत्व
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4 leading-tight">
                {pageContent.foundersSection.title}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {pageContent.foundersSection.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {foundersTeam.map((member, index) => (
                <TeamMemberCard
                  key={member.id}
                  member={member}
                  priority={index < 3}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="state-team" className="space-y-8 lg:space-y-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4 lg:mb-6">
                <MapPin className="w-4 h-4" />
                राज्य टीम
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4 leading-tight">
                {pageContent.stateTeamSection.title}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {pageContent.stateTeamSection.subtitle}
              </p>
            </div>

            {stateTeam.length === 0 ? (
              <div className="text-center py-16 lg:py-20">
                <div className="max-w-md mx-auto bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 lg:p-12 border border-primary/20 shadow-lg">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                    जल्द ही आ रहा है
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    राज्य टीम के सदस्यों की जानकारी जल्द ही यहां उपलब्ध होगी।
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground/80 mt-4">
                    Will be shown soon
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="w-full max-w-5xl bg-background border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <Filter className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground text-sm sm:text-base">
                        राज्य के अनुसार फ़िल्टर करें
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                      <Button
                        variant={selectedState === "all" ? "default" : "outline"}
                        size="sm"
                        className="h-auto py-2 px-4 text-sm font-medium rounded-lg transition-all hover:scale-105"
                        onClick={() => setSelectedState("all")}
                      >
                        सभी राज्य
                      </Button>
                      {uniqueStates.map((state) => (
                        <Button
                          key={state}
                          variant={selectedState === state ? "default" : "outline"}
                          size="sm"
                          className="h-auto py-2 px-4 text-sm font-medium rounded-lg transition-all hover:scale-105"
                          onClick={() => setSelectedState(state)}
                        >
                          {state}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                  {filteredStateTeam.map((member) => (
                    <TeamMemberCard key={member.id} member={member} />
                  ))}
                </div>

                {filteredStateTeam.length === 0 && (
                  <div className="text-center py-16 lg:py-20">
                    <div className="max-w-md mx-auto bg-muted/30 rounded-2xl p-8 lg:p-12 border border-border">
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        कोई टीम सदस्य नहीं मिला
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        चुने गए राज्य के लिए कोई टीम सदस्य उपलब्ध नहीं है।
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-12 lg:mt-16 pt-10 lg:pt-12 border-t">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-around divide-x divide-border">
                {/* मुख्य नेतृत्व */}
                <div className="flex-1 text-center px-3 sm:px-4 lg:px-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                    <Crown className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                    {foundersTeam.length}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">
                    मुख्य नेतृत्व
                  </p>
                </div>

                {/* राज्य कवरेज */}
                <div className="flex-1 text-center px-3 sm:px-4 lg:px-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                    {uniqueStates.length}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">
                    राज्य कवरेज
                  </p>
                </div>

                {/* राज्य टीम सदस्य */}
                <div className="flex-1 text-center px-3 sm:px-4 lg:px-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 lg:mb-4">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1">
                    {stateTeam.length}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">
                    राज्य टीम सदस्य
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundersTeamPage;
