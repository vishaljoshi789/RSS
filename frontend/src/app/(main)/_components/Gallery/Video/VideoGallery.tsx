"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Play,
  Clock,
  Calendar,
  Video as VideoIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  videoCategories,
  getVideosByCategory,
  formatDuration,
  formatDate,
  VideoItem,
} from "./Video";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

interface VideoCardProps {
  video: VideoItem;
  index: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  return (
    <Dialog onOpenChange={(open) => {
      if (open) setVideoLoading(true);
    }}>

      <DialogTrigger asChild>
        <Card className="group cursor-pointer bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
          <CardContent className="p-0">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              {!imageError ? (
                <>
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                    sizes="320px"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setImageError(true);
                      setIsLoading(false);
                    }}
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                  />
                  {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                </>
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <VideoIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 rounded-full p-3 shadow-lg">
                    <Play className="w-8 h-8 text-orange-600 fill-current ml-1" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-3 right-3">
                <Badge className="bg-black/70 text-white font-semibold">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(video.duration)}
                </Badge>
              </div>

              <div className="absolute top-3 left-3">
                <Badge
                  variant="secondary"
                  className={`
                    ${
                      video.category === "event"
                        ? "bg-blue-500/90 text-white"
                        : ""
                    }
                    ${
                      video.category === "training"
                        ? "bg-green-500/90 text-white"
                        : ""
                    }
                    ${
                      video.category === "ceremony"
                        ? "bg-purple-500/90 text-white"
                        : ""
                    }
                    ${
                      video.category === "other"
                        ? "bg-gray-500/90 text-white"
                        : ""
                    }
                    font-semibold shadow-lg backdrop-blur-sm
                  `}
                >
                  {video.category.charAt(0).toUpperCase() +
                    video.category.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight line-clamp-2">
                {video.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(video.uploadDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-6xl w-full p-0 bg-black border-0">
        <DialogTitle className="sr-only">
          {video.title} - Video Player
        </DialogTitle>
        <div className="relative bg-black rounded-lg overflow-hidden">
          <div className="relative aspect-video">
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <p className="text-white text-sm">Loading video...</p>
                </div>
              </div>
            )}
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setVideoLoading(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const VideoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const filteredVideos = useMemo(() => {
    return getVideosByCategory(activeCategory);
  }, [activeCategory]);

  return (
    <div className="w-full">
      {/*       
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {videoCategories.map((category) => (
          <Button
            key={category.key}
            variant={activeCategory === category.key ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.key)}
            className="flex items-center gap-2"
          >
            <span className="text-base">{category.icon}</span>
            <span>{category.label}</span>
          </Button>
        ))}
      </div> */}

      <div className="text-center mb-6">
        <p className="text-gray-600">
          Showing{" "}
          <span className="font-semibold text-orange-600">
            {filteredVideos.length}
          </span>{" "}
          videos
          {activeCategory !== "all" && (
            <span>
              {" "}
              in{" "}
              <span className="font-semibold">
                {
                  videoCategories.find((cat) => cat.key === activeCategory)
                    ?.label
                }
              </span>
            </span>
          )}
        </p>
      </div>

      {/* Swiper Video Gallery */}
      <div className="relative max-w-5xl mx-auto">
        {/* Custom Navigation Buttons */}
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
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3.5,
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
  );
};

export default VideoGallery;
