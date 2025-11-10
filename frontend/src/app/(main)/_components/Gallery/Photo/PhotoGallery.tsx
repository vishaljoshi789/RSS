"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, ZoomIn, ArrowRight } from "lucide-react";
import { getPhotosByCategory, PhotoItem } from "./Photo";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

interface PhotoCardProps {
  photo: PhotoItem;
  index: number;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group cursor-pointer overflow-hidden rounded-lg break-inside-avoid mb-4 transition-all duration-300 transform hover:scale-[1.02]">
          {/* Mobile: Fixed aspect ratio */}
          <div className="relative lg:hidden overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-video">
            {!imageError ? (
              <>
                <Image
                  src={photo.imageUrl}
                  alt={photo.alt}
                  fill
                  className={`object-cover transition-transform duration-300 group-hover:scale-110 rounded-lg ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                  sizes="100vw"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setIsLoading(false);
                  }}
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                )}
              </>
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-lg">
                <div className="text-gray-400 text-center">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Image not found</p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center rounded-lg">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-semibold">Click to view</p>
              </div>
            </div>

            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Badge
                variant="secondary"
                className={`
                  ${
                    photo.category === "religious"
                      ? "bg-orange-500/90 text-white"
                      : ""
                  }
                  ${
                    photo.category === "social"
                      ? "bg-green-500/90 text-white"
                      : ""
                  }
                  ${
                    photo.category === "other"
                      ? "bg-blue-500/90 text-white"
                      : ""
                  }
                  font-semibold shadow-lg backdrop-blur-sm
                `}
              >
                {photo.category.charAt(0).toUpperCase() +
                  photo.category.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Desktop: Pinterest-style natural dimensions */}
          <div className="hidden lg:block relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            {!imageError ? (
              <>
                <Image
                  src={photo.imageUrl}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className={`w-full h-auto transition-transform duration-300 group-hover:scale-110 rounded-lg ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setIsLoading(false);
                  }}
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                />
                {isLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                )}
              </>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                <div className="text-gray-400 text-center">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Image not found</p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center rounded-lg">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-semibold">Click to view</p>
              </div>
            </div>

            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Badge
                variant="secondary"
                className={`
                  ${
                    photo.category === "religious"
                      ? "bg-orange-500/90 text-white"
                      : ""
                  }
                  ${
                    photo.category === "social"
                      ? "bg-green-500/90 text-white"
                      : ""
                  }
                  ${
                    photo.category === "other"
                      ? "bg-blue-500/90 text-white"
                      : ""
                  }
                  font-semibold shadow-lg backdrop-blur-sm
                `}
              >
                {photo.category.charAt(0).toUpperCase() +
                  photo.category.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-7xl w-[95vw] sm:w-[90vw] p-0 bg-black border-0 gap-0">
        <DialogTitle className="sr-only">
          {photo.title} - Photo Gallery
        </DialogTitle>

        {/* Image Container */}
        <div className="relative bg-black overflow-hidden">
          <div className="relative max-h-[85vh] flex items-center justify-center bg-black">
            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black z-10 transition-opacity duration-500">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-orange-500/20 rounded-full" />
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-white text-base font-medium">
                      Loading image...
                    </p>
                    <p className="text-gray-400 text-sm">Please wait</p>
                  </div>
                </div>
              </div>
            )}

            {!imageError ? (
              <Image
                src={photo.imageUrl}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className={`w-full h-auto max-h-[85vh] object-contain transition-opacity duration-300 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                priority
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setImageError(true);
                  setIsLoading(false);
                }}
              />
            ) : (
              <div className="w-full h-96 bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Image could not be loaded</p>
                </div>
              </div>
            )}
          </div>

          {/* Image Info Bar - Below the image */}
          <div className="bg-gradient-to-b from-black/90 to-black p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2 leading-tight">
                  {photo.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  Dimensions: {photo.width} × {photo.height}px
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <Badge
                  variant="secondary"
                  className={`
                    ${
                      photo.category === "religious"
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : ""
                    }
                    ${
                      photo.category === "social"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : ""
                    }
                    ${
                      photo.category === "other"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : ""
                    }
                  `}
                >
                  {photo.category.charAt(0).toUpperCase() +
                    photo.category.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PhotoGallery: React.FC = () => {
  const [activeCategory] = useState("all");
  const [isLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filteredPhotos = useMemo(() => {
    return getPhotosByCategory(activeCategory);
  }, [activeCategory]);

  const displayedPhotos = useMemo(() => {
    if (showAll) return filteredPhotos;

    const desktopLimit = 17;

    return filteredPhotos.slice(0, desktopLimit);
  }, [filteredPhotos, showAll]);

  const hasMorePhotos = filteredPhotos.length > 17;

  return (
    <div className="w-full">
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Loading photos...</span>
          </div>
        </div>
      )}

      <div
        className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-0 transition-opacity duration-300 ${
          isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        {displayedPhotos.map((photo, index) => {
          // Hide photos beyond mobile limit on mobile devices
          const hiddenOnMobile = !showAll && index >= 5;
          return (
            <div
              key={photo.id}
              className={hiddenOnMobile ? "hidden sm:block" : ""}
            >
              <PhotoCard photo={photo} index={index} />
            </div>
          );
        })}
      </div>

      {/* View All Photos Button */}
      {hasMorePhotos && !showAll && !isLoading && (
        <div className="text-center mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-base hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <ZoomIn className="w-5 h-5" />
            View All Photos ({filteredPhotos.length})
          </button>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-base hover:bg-secondary/90 transition-colors duration-300 shadow-lg hover:shadow-xl border-2 border-border"
          >
            View More Photos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-base hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
          View More Photos
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {filteredPhotos.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No photos found
          </h3>
          <p className="text-gray-600">
            No photos available in the {activeCategory} category.
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
