"use client";

import React, { useState } from "react";
import Image from "next/image";
import { pageContent, supporterImages, videoInfo } from "./SupporterInfo";
import NormalButton from "@/components/common/RssButton/RssButton";
import { Landmark, Play, Target } from "lucide-react";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";
import { Badge } from "@/components/ui/badge";

const Supporters = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const row1 = supporterImages.slice(0, 4);
  const row2 = supporterImages.slice(4, 8);

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4 lg:mb-6">
            <Play className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            <span className="text-sm lg:text-base text-primary font-semibold">
              {pageContent.organizationName}
            </span>
          </div>
          {/* <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb- lg:mb-6 ">
            The
          </h2> */}
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 lg:mb-6 ">
            Rashtriya Seva <span className="text-red-600">Sangh</span>
          </h2>
          <p className="text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {pageContent.mainSubtitle}
          </p>
          <div className="flex justify-center mt-6 lg:mt-8">
            <div className="w-24 lg:w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="mb-16 lg:mb-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4 lg:mb-6">
                  {pageContent.introSection.title}
                </h2>
                <p className="text-base lg:text-lg text-muted-foreground  text-justify leading-relaxed">
                  {pageContent.introSection.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <NormalButton
                  variant="primary"
                  size="lg"
                  icon={Target}
                  showArrow={false}
                  className="px-6 py-3 font-semibold"
                >
                  {pageContent.introSection.joinButtonText}
                </NormalButton>

                <NormalButton
                  variant="secondary"
                  size="lg"
                  showArrow={true}
                  className="px-6 py-3 font-semibold"
                >
                  {pageContent.introSection.learnMoreButtonText}
                </NormalButton>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div
                className="relative aspect-video bg-muted rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                onClick={() => setIsVideoModalOpen(true)}
              >
                <Image
                  src={videoInfo.posterSrc}
                  alt={videoInfo.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                />

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-white transition-all duration-300 shadow-xl">
                    <Play
                      className="w-7 h-7 lg:w-9 lg:h-9 text-primary ml-1"
                      fill="currentColor"
                    />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm p-3 lg:p-4 rounded-xl border border-border">
                  <h3 className="font-semibold text-foreground text-sm lg:text-base mb-1">
                    {videoInfo.title}
                  </h3>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    {videoInfo.duration}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8 lg:mb-12">
          <div className="text-center ">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Landmark className="w-4 h-4 mr-2" />
            संस्थागत नींव
          </Badge>
        </div>

          <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-6 lg:mb-8">
            Our Recognition
          </h2>

          <div className="flex justify-center mb-8 lg:mb-10">
            <div className="w-24 lg:w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-4 sm:gap-6 lg:gap-12 mb-6 lg:mb-12">
            {row1.map((supporter) => (
              <div
                key={supporter.id}
                className="flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105"
              >
                <Image
                  src={supporter.imageUrl}
                  alt={supporter.alt}
                  width={180}
                  height={120}
                  className="object-contain w-full h-10 sm:h-14 lg:h-20 transition-all duration-300"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                />
              </div>
            ))}
          </div>

          {row2.length > 0 && (
            <div className="grid grid-cols-4 gap-4 sm:gap-6 lg:gap-12 max-w-4xl mx-auto">
              {row2.map((supporter) => (
                <div
                  key={supporter.id}
                  className="flex items-center justify-center opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105"
                >
                  <Image
                    src={supporter.imageUrl}
                    alt={supporter.alt}
                    width={180}
                    height={120}
                    className="object-contain w-full h-10 sm:h-14 lg:h-20 transition-all duration-300"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110 border border-white/20"
              aria-label="Close video"
            >
              <span className="text-2xl font-light">×</span>
            </button>

            <video
              controls
              autoPlay
              className="w-full h-full"
              poster={videoInfo.posterSrc}
            >
              <source src={videoInfo.videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  );
};

export default Supporters;
