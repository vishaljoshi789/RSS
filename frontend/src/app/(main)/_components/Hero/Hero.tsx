"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Globe, Award, Users, MapPin } from "lucide-react";
import { heroSlides } from "./HeroData";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative bg-muted/30">
      <div className="relative z-10 px-4 py-12 sm:py-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:py-20 xl:py-28 lg:grid lg:grid-cols-2">
        <div className="lg:pr-8 pt-12 lg:pt-0">
          <div className="lg:hidden">
            <div className="w-full overflow-x-auto">
              <div className="flex gap-4 px-4 py-6">
                {heroSlides.map((slide) => (
                  <Link
                    key={slide.id}
                    href={slide.ctaLink}
                    className="flex-shrink-0 block"
                  >
                    <div className="relative w-[320px] h-[180px] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto sm:max-w-lg lg:mx-0 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-2 mb-6 px-4 py-3 text-sm sm:text-base font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border border-orange-300/50 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
              >
                <Heart className="w-6 h-6 sm:w-5 sm:h-5 flex-shrink-0 text-white" />
                <span className="text-white font-medium">
                  United for Dharma, Dedicated for Nation
                </span>
              </Badge>
            </div>

            <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl mb-4">
              Building a Vedic Nation
              <span className="inline-block relative">
                {/* <Image
                  src="/Svg/shape-1.svg"
                  alt="thunder"
                  width={40}
                  height={40}
                  className="inline w-auto h-8 sm:h-10 lg:h-12"
                /> */}
              </span>
              made by RSS
              {/* <span className="inline-block relative">
                <Image
                  src="/Svg/shape-2.svg"
                  alt="spark"
                  width={24}
                  height={37}
                  className="inline w-auto h-8 sm:h-10 lg:h-11"
                />
              </span> */}
            </h1>

            <h2 className="text-xl font-semibold text-primary/80 font-serif mb-6">
              वैदिक राष्ट्र का निर्माण, आरएसएस द्वारा
            </h2>

            <p className="mt-6 text-base font-normal leading-7 text-muted-foreground">
              Join us in our mission to restore traditional values and build a
              stronger nation through dedicated service.
            </p>

            <div className="mt-8">
              <p className="text-base font-bold text-foreground mb-6">
                Our Growing Community
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-primary mr-2" />
                    <div className="text-2xl font-bold text-primary">10K+</div>
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Active Members
                  </div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <MapPin className="w-5 h-5 text-primary mr-2" />
                    <div className="text-2xl font-bold text-primary">50+</div>
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Cities
                  </div>
                </div>
                <div className="text-center p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-center mb-2">
                    <Award className="w-5 h-5 text-primary mr-2" />
                    <div className="text-2xl font-bold text-primary">100+</div>
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Projects
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-3 sm:gap-4 mt-8 justify-center lg:justify-start">
              <Button
                size="lg"
                className="px-4 sm:px-8 py-3 font-semibold text-sm sm:text-base flex-1 sm:flex-none"
                asChild
              >
                <Link
                  href="https://app.joinrss.org.in/registration"
                  className="flex items-center justify-center text-white"
                >
                  Join Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-4 sm:px-8 py-3 font-semibold border-2 text-sm sm:text-base flex-1 sm:flex-none"
                asChild
              >
                <Link
                  href="#about"
                  className="flex items-center justify-center"
                >
                  Learn More
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block pb-8 lg:pb-0">
        <div className="flex flex-col items-center justify-center lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 lg:z-20">
          <div className="w-full px-4 lg:px-8 overflow-x-auto hero-scroll">
            <div className="flex gap-6 pb-4 w-max">
              {heroSlides.map((slide) => (
                <div key={slide.id} className="flex-shrink-0">
                  <div className="relative flex flex-col overflow-hidden transition-all duration-200 transform bg-background border border-border shadow w-60 md:w-80 h-[500px] group rounded-xl hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                    <Link
                      href={slide.ctaLink}
                      className="flex shrink-0 cursor-pointer"
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        width={320}
                        height={240}
                        className="object-cover w-full h-48 transition-all duration-200 transform group-hover:scale-110 pointer-events-none"
                      />
                    </Link>
                    <div className="flex-1 px-4 py-5 sm:p-6 flex flex-col">
                      <Link
                        href={slide.ctaLink}
                        className="flex-1 cursor-pointer"
                      >
                        <p className="text-lg font-bold text-foreground line-clamp-2">
                          {slide.title}
                        </p>
                        <p className="text-base font-semibold text-primary/80 font-serif mt-2 line-clamp-1">
                          {slide.titleHindi}
                        </p>
                        <p className="mt-3 text-sm font-normal leading-6 text-muted-foreground line-clamp-3">
                          {slide.description}
                        </p>
                      </Link>
                    </div>
                    <div className="px-4 py-4 border-t border-border sm:px-6 mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-foreground">
                            RSS Service
                          </p>
                          <span className="text-sm font-medium text-muted-foreground">
                            •
                          </span>
                          <p className="text-sm font-medium text-muted-foreground">
                            Join Now
                          </p>
                        </div>
                        <Link href={slide.ctaLink} className="cursor-pointer">
                          <ArrowRight className="w-5 h-5 text-muted-foreground transition-all duration-200 group-hover:text-primary" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
