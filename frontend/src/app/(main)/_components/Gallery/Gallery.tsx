"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PhotoGallery from "./Photo/PhotoGallery";
import  { VideoCard } from "./Video/VideoGallery";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  VideoIcon,
} from "lucide-react";
import { getVideosByCategory } from "./Video/Video";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";


const Gallery = () => {
  const [activeCategory] = useState("all");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const filteredVideos = useMemo(() => {
    return getVideosByCategory(activeCategory);
  }, [activeCategory]);

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-orange-600">Gallery</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our visual journey through photos and videos showcasing our
            activities, events, and community engagement across different
            categories.
          </p>
        </div>

        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 to-green-200/30 rounded-3xl blur-3xl -z-10"></div>

          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Images className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Photo Gallery
                </h3>
              </div>
              <PhotoGallery />
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-200/30 to-orange-200/30 rounded-3xl blur-3xl -z-10"></div>

          <div className="w-full">
            <div className="relative max-w-5xl mx-auto">
              <button
                onClick={() => swiperInstance?.slidePrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={filteredVideos.length === 0}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              <button
                onClick={() => swiperInstance?.slideNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={filteredVideos.length === 0}
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>

              {filteredVideos.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  breakpoints={{
                    640: {
                      slidesPerView: 1.2,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 24,
                    },
                    1024: {
                      slidesPerView: 2.5,
                      spaceBetween: 30,
                    },
                    1280: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                  }}
                  onSwiper={setSwiperInstance}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  className="pb-12"
                >
                  {filteredVideos.map((video, index) => (
                    <SwiperSlide key={video.id}>
                      <VideoCard video={video} index={index} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="text-center py-16">
                  <VideoIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No videos found
                  </h3>
                  <p className="text-gray-600">
                    No videos available in the {activeCategory} category.
                  </p>
                </div>
              )}
            </div>

            <style jsx global>{`
              .swiper-pagination-bullet {
                background: #f97316;
                opacity: 0.5;
              }
              .swiper-pagination-bullet-active {
                opacity: 1;
              }
            `}</style>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
