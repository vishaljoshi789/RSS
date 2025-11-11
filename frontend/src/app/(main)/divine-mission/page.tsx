"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  divineMissionData,
  missionSectionData,
} from "../_components/DivineMission/MissionInfo";
import {
  Heart,
  Users,
  ArrowRight,
  Calendar,
  Clock,
  Shield,
  Sparkles,
} from "lucide-react";
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

const DivineMissionPage = () => {
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
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <Badge className="mb-6 px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 mr-1.5" />
            सेवा क्षेत्र
          </Badge>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-sm">
            {missionSectionData.title}
          </h1>

          <p className="text-base sm:text-lg text-white/95 font-medium mb-3 max-w-3xl mx-auto">
            {missionSectionData.subtitle}
          </p>

          <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto leading-relaxed">
            समाज सेवा, धर्म रक्षा और राष्ट्र निर्माण के लिए राष्ट्रीय सेवा संघ
            के पवित्र मिशन
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
              <div className="text-4xl font-bold text-primary mb-2">7+</div>
              <div className="text-sm text-gray-700 font-medium">
                सक्रिय मिशन
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-gray-700 font-medium">
                सेवा कार्यक्रम
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-gray-700 font-medium">
                सेवाभावी सदस्य
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
              <div className="text-4xl font-bold text-primary mb-2">∞</div>
              <div className="text-sm text-gray-700 font-medium">
                समर्पण और सेवा
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border-2 border-orange-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  हमारा उद्देश्य
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                राष्ट्रीय सेवा संघ भारतवर्ष सनातन धर्म, संस्कृति और राष्ट्रीय
                एकता की रक्षा के लिए समर्पित है। हमारे सभी मिशन समाज के उत्थान
                और देश की प्रगति के लिए समर्पित हैं।
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  हमारा दृष्टिकोण
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                प्रत्येक मिशन के माध्यम से हम समाज में सकारात्मक परिवर्तन लाने
                और भारत को एक मजबूत, आत्मनिर्भर और संस्कारवान राष्ट्र बनाने के
                लिए प्रतिबद्ध हैं।
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              हमारे सभी मिशन
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              प्रत्येक मिशन समाज के विभिन्न पहलुओं में सकारात्मक बदलाव लाने के
              लिए समर्पित है
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {divineMissionData.map((mission) => (
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
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative overflow-hidden bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-primary/10">
          
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              इन मिशनों में शामिल हों
            </h2>

            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
              राष्ट्रीय सेवा संघ के इन पवित्र मिशनों में अपना योगदान देकर समाज
              सेवा का हिस्सा बनें। आपका हर छोटा योगदान समाज में बड़ा परिवर्तन ला
              सकता है।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/become-member"
                aria-label="सदस्य बनें"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Users className="w-5 h-5" />
                <span>सदस्य बनें</span>
                <ArrowRight className="w-4 h-4 opacity-90" />
              </Link>

              <Link
                href="/donate-now"
                aria-label="दान करें"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl"
              >
                <Heart className="w-5 h-5" />
                <span>दान करें</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1">
                <Shield className="w-3.5 h-3.5 text-primary" /> सुरक्षित भुगतान
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> कर रसीद उपलब्ध
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1">
                <Users className="w-3.5 h-3.5 text-primary" /> समुदाय समर्थन
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DivineMissionPage;
