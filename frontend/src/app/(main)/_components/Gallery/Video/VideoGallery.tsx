"use client";

import React, { useState } from "react";
import Image from "next/image";
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
} from "lucide-react";
import {
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

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  return (
    <Dialog onOpenChange={(open) => {
      if (open) setVideoLoading(true);
    }}>

      <DialogTrigger asChild>
        <Card className="group cursor-pointer bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden">
          <CardContent className="p-0">
            
            <div className="relative aspect-video">
              {!imageError ? (
                <>
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
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

              
              <div className="absolute inset-0 bg-black/0 lg:group-hover:bg-black/30 transition-all duration-300" />

              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 lg:group-hover:bg-white rounded-full p-3 lg:p-4 shadow-lg transform lg:group-hover:scale-110 transition-all duration-300">
                  <Play className="w-8 h-8 lg:w-10 lg:h-10 text-orange-600 fill-current ml-0.5 lg:ml-1" />
                </div>
              </div>

              
              <div className="absolute top-3 right-3">
                <Badge className="bg-black/70 text-white font-semibold text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(video.duration)}
                </Badge>
              </div>

              
              <div className="absolute top-3 left-3">
                <Badge
                  variant="secondary"
                  className={`
                    text-xs
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

            
            <div className="p-4 lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:p-4 lg:text-white lg:bg-gradient-to-t lg:from-black/80 lg:via-black/50 lg:to-transparent lg:transform lg:translate-y-2 lg:group-hover:translate-y-0 lg:transition-transform lg:duration-300">
              <h3 className="font-bold text-gray-900 lg:text-white text-base lg:text-lg mb-1 leading-tight line-clamp-2 lg:drop-shadow-lg">
                {video.title}
              </h3>
              <p className="text-gray-600 lg:text-white/90 text-sm mb-2 line-clamp-2 lg:line-clamp-1 lg:drop-shadow-md lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-300">
                {video.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500 lg:text-white/80">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(video.uploadDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-7xl w-[95vw] sm:w-[90vw] p-0 bg-black border-0 gap-0">
        <DialogTitle className="sr-only">
          {video.title} - Video Player
        </DialogTitle>
        
        
        <div className="relative bg-black overflow-hidden">
          <div className="relative aspect-video bg-black">
            
            {videoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black z-10 transition-opacity duration-500">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full" />
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-white text-base font-medium">Loading video...</p>
                    <p className="text-gray-400 text-sm">Please wait</p>
                  </div>
                </div>
              </div>
            )}
            
            
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="w-full h-full absolute inset-0 border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
              allowFullScreen
              loading="lazy"
              onLoad={() => setVideoLoading(false)}
              style={{ colorScheme: 'dark' }}
            />
          </div>
          
          
          <div className="bg-gradient-to-b from-black/90 to-black p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2 leading-tight">
                  {video.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {video.description}
                </p>
              </div>
              
              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(video.duration)}
                </Badge>
                <Badge className="bg-gray-700 hover:bg-gray-600 text-white">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(video.uploadDate)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};