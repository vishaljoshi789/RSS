"use client";

import React from "react";
import Image from "next/image";
import { Quote, Star, Users } from "lucide-react";
import { founderInfo } from "./FounderInfo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

const Founder = () => {
  return (
    <section className="bg-gradient-to-b from-background via-primary/5 to-background mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 lg:mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-full mb-4 lg:mb-6">
            <Star className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            <span className="text-sm lg:text-base text-primary font-semibold">
              Leadership
            </span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">
            Meet Our Team
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            The visionaries leading our mission to serve the nation
          </p>
        </div>

        <div className="text-center mb-8 lg:mb-12 space-y-4 px-4 lg:px-0">
          <p className="text-xl lg:text-3xl font-bold text-primary">
            {founderInfo.greeting}
          </p>
          <h3 className="text-lg lg:text-2xl font-semibold text-foreground">
            {founderInfo.orgName}
          </h3>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {founderInfo.description}
          </p>
        </div>

        <div className="block lg:hidden mb-10">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            spaceBetween={20}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="pb-12"
          >
            {founderInfo.members.map((member) => (
              <SwiperSlide key={member.id}>
                <div className="flex flex-col items-center px-4">
                  <div className="relative w-64 h-72 rounded-2xl overflow-hidden shadow-xl mb-4 bg-muted">
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="256px"
                      className="object-cover w-full h-full"
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  <div className="text-center bg-background/95 backdrop-blur-md p-4 rounded-xl border border-border w-full max-w-xs">
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-2">
                      {member.designation}
                    </p>
                    {member.quote && (
                      <p className="text-sm text-muted-foreground italic">
                        &ldquo;{member.quote}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {founderInfo.members.map((member) => (
            <div
              key={member.id}
              className="group relative bg-background rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="relative w-full h-80 overflow-hidden bg-muted">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  sizes="(max-width: 1279px) 50vw, 25vw"
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 bg-background/95 backdrop-blur-md border-t border-border">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-2">
                  {member.designation}
                </p>
                {member.quote && (
                  <p className="text-xs text-muted-foreground italic line-clamp-2">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="relative mx-4 lg:mx-0 mb-10">
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 lg:p-10 rounded-2xl lg:rounded-3xl border border-primary/20 relative overflow-hidden">
            <div className="absolute top-4 left-4 lg:top-6 lg:left-8 w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-full" />
            <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-8 w-6 h-6 lg:w-8 lg:h-8 bg-primary/20 rounded-full" />

            <div className="relative flex flex-col items-center text-center">
              <Quote className="w-8 h-8 lg:w-11 lg:h-11 text-primary/40 mb-4 lg:mb-6" />
              <blockquote className="text-lg lg:text-2xl xl:text-3xl font-bold text-foreground leading-relaxed mb-5 lg:mb-7 max-w-4xl px-2">
                &ldquo;{founderInfo.quote}&rdquo;
              </blockquote>
              <cite className="text-base lg:text-lg text-primary font-semibold">
                - {founderInfo.members[0].name}
              </cite>
            </div>
          </div>
        </div>

        <div className="text-center mx-4 lg:mx-0">
          <div className="max-w-4xl mx-auto bg-background p-6 lg:p-9 rounded-2xl border border-border shadow-lg">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-full mb-4">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm text-primary font-semibold">
                Join Us
              </span>
            </div>
            <h4 className="text-xl lg:text-3xl font-bold text-foreground mb-4 lg:mb-5">
              Join Our Mission
            </h4>
            <p className="text-base lg:text-xl text-muted-foreground leading-relaxed mb-6 lg:mb-8 px-2">
              {founderInfo.callToAction}
            </p>

            <div className="flex justify-center">
              <div className="w-24 lg:w-32 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
