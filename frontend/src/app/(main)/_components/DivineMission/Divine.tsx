"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
// Using custom card markup instead of shadcn Card components
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { divineMissionData, missionSectionData } from "./MissionInfo";
import { Heart, Calendar, Clock, ArrowRight } from "lucide-react";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

const truncateText = (text: string, maxWords: number) => {
  const words = text.split(" ");
  if (words.length <= maxWords) {
    return { text, isTruncated: false };
  }
  return {
    text: words.slice(0, maxWords).join(" ") + "...",
    isTruncated: true,
  };
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

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 leading-tight">
            Our Divine <span className="text-red-600"> Mission</span>
          </h2>

          <p className="text-md md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {missionSectionData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {divineMissionData.slice(0, 4).map((mission) => (
            <Link
              key={mission.id}
              href={`/divine-mission/${mission.id}`}
              className="block"
            >
              <div
                role="article"
                className="group overflow-hidden border shadow-md hover:shadow-2xl transition-all duration-500 bg-card cursor-pointer h-full flex flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={mission.image}
                    alt={mission.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                  />
                </div>

                <div className="flex-1 flex flex-col p-3">
                  <div className="mb-3">
                    <Badge
                      className={`${
                        mission.type === "ongoing"
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      } text-xs font-semibold`}
                    >
                      {mission.type === "ongoing" ? (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          चल रहा है
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3 h-3 mr-1" />
                          आगामी
                        </>
                      )}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-foreground leading-tight mb-3 group-hover:text-primary transition-colors duration-300">
                    {mission.title}
                  </h3>

                  <div className="flex-1 mb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {(() => {
                        const { text, isTruncated } = truncateText(
                          mission.description,
                          15
                        );
                        return (
                          <>
                            {text}
                            {isTruncated && (
                              <span className="inline-flex items-center gap-1 ml-1 text-primary font-semibold hover:underline">
                                आगे पढ़ें
                                <ArrowRight className="w-3 h-3" />
                              </span>
                            )}
                          </>
                        );
                      })()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={mission.author.image}
                          alt={mission.author.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {mission.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-foreground">
                        {mission.author.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{mission.postedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/divine-mission"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            <span>सभी मिशन देखें</span>
            <span className="text-xl">→</span>
          </Link>
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
