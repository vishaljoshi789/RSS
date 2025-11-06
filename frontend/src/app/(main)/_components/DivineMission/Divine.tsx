"use client";

import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { divineMissionData, missionSectionData } from "./MissionInfo";
import {
  Heart,
  GraduationCap,
  Users,
  Shield,
  Store,
  Mountain,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

const getIcon = (id: number) => {
  const iconProps = { className: "w-5 h-5 text-primary" };
  switch (id) {
    case 1:
      return <Shield {...iconProps} />;
    case 2:
      return <Heart {...iconProps} />;
    case 3:
      return <GraduationCap {...iconProps} />;
    case 4:
      return <Users {...iconProps} />;
    case 5:
      return <Store {...iconProps} />;
    case 6:
      return <Mountain {...iconProps} />;
    case 7:
      return <Sparkles {...iconProps} />;
    default:
      return <Heart {...iconProps} />;
  }
};

const Divine = () => {
  return (
    <section
      className="py-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background"
      id="our-work"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Heart className="w-4 h-4 mr-2" />
            सेवा क्षेत्र
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {missionSectionData.title}
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {missionSectionData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {divineMissionData.slice(0, 4).map((mission) => (
            <Card
              key={mission.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm hover:scale-105 p-2"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={mission.image}
                  alt={mission.alt}
                  fill
                  className="object-cover rounded-md transition-transform duration-500 group-hover:scale-110"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md">
                    {getIcon(mission.id)}
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg md:text-xl font-bold text-foreground leading-tight line-clamp-2">
                  {mission.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-3">
                  {mission.description}
                </CardDescription>

                <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>और पढ़ें</span>
                  <div className="ml-1 w-0 group-hover:w-4 transition-all duration-300 overflow-hidden">
                    <span>→</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              सेवा में शामिल हों
            </h3>
            <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              राष्ट्रीय सेवा संघ के इन पवित्र मिशनों में अपना योगदान देकर समाज सेवा का हिस्सा बनें
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer">
                सदस्यता लें
              </div>
              <div className="border border-primary text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary hover:text-white transition-colors cursor-pointer">
                अधिक जानें
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Divine;
