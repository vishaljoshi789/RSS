"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Award, Users, MapPin } from "lucide-react";
import { heroSlides } from "./HeroData";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";

const Hero = () => {
  const mobileModules = [Autoplay];
  const desktopModules = [Autoplay, FreeMode];

  return (
    <>
      {/* mobile slider */}
      <div className="lg:hidden w-full bg-gradient-to-b from-background via-primary/5 to-background py-4 mt-18">
        <div className="w-full">
          <Swiper
            modules={mobileModules}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            speed={1000}
            watchSlidesProgress={true}
            className="px-2"
          >
            {heroSlides.filter((slide) => slide.id < 8).map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <Link href={slide.ctaLink} className="block">
                  <div className="relative w-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-[16/9] bg-muted">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1023px) 100vw"
                      className="object-cover w-full h-full"
                      loading={index === 0 ? "eager" : "lazy"}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k="
                    />
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <section className="relative bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="relative z-10 px-4 sm:py-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:py-20 xl:py-28 lg:grid lg:grid-cols-2">
          
          <div className="lg:pr-8 pt-4 lg:pt-0">
            <div className="max-w-md mx-auto sm:max-w-lg lg:mx-0 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start">
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-2 mb-6 px-4 py-3 text-sm sm:text-base font-medium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border border-orange-300/50 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                >
                  
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
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-background dark:from-orange-950/20 dark:to-background rounded-lg border border-orange-200/50 dark:border-orange-800/30 shadow-[inset_0_2px_8px_rgba(249,115,20,0.10)] hover:shadow-[inset_0_2px_12px_rgba(249,115,22,0.12)] transition-all duration-300">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-orange-600 dark:text-orange-500 mr-2" />
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                        10K+
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                      Active Members
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-background dark:from-orange-950/20 dark:to-background rounded-lg border border-orange-200/50 dark:border-orange-800/30 shadow-[inset_0_2px_8px_rgba(249,115,20,0.10)] hover:shadow-[inset_0_2px_12px_rgba(249,115,22,0.12)] transition-all duration-300">
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-500 mr-2" />
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">50+</div>
                    </div>
                    <div className="text-xs md:text-sm text-muted-foreground">
                      Cities
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-background dark:from-orange-950/20 dark:to-background rounded-lg border border-orange-200/50 dark:border-orange-800/30 shadow-[inset_0_2px_8px_rgba(249,115,20,0.10)] hover:shadow-[inset_0_2px_12px_rgba(249,115,22,0.12)] transition-all duration-300">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="w-5 h-5 text-orange-600 dark:text-orange-500 mr-2" />
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                        100+
                      </div>
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
            <div className="w-full px-4 lg:px-8">
              <Swiper
                modules={desktopModules}
                spaceBetween={24}
                freeMode={true}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                loop={true}
                speed={800}
                watchSlidesProgress={true}
                breakpoints={{
                  1024: {
                    slidesPerView: 1.5,
                  },
                  1280: {
                    slidesPerView: 2,
                  },
                  1440: {
                    slidesPerView: 2.2,
                  },
                  1680: {
                    slidesPerView: 2.4,
                  },
                }}
              >
                {heroSlides.map((slide, index) => (
                  <SwiperSlide key={slide.id} style={{ width: "320px" }}>
                    <div className="relative flex flex-col overflow-hidden transition-all duration-200 transform bg-background border border-border shadow w-80 h-[500px] group rounded-xl hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                      <Link href={slide.ctaLink} className="block">
                        <div className="relative w-full overflow-hidden aspect-[4/3] bg-muted">
                          <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            priority={index < 3}
                            sizes="(min-width: 1024px) 320px, 100vw"
                            className="object-cover w-full h-full transition-all duration-200 transform group-hover:scale-110"
                            loading={index < 3 ? "eager" : "lazy"}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k="
                          />
                        </div>
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
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
