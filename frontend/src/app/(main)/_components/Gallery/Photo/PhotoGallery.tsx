"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, ZoomIn, ArrowRight } from "lucide-react";
import { photoCategories, getPhotosByCategory, PhotoItem } from "./Photo";

interface PhotoCardProps {
  photo: PhotoItem;
  index: number;
}

const PhotoCard: React.FC<PhotoCardProps> = ({ photo, index }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group cursor-pointer overflow-hidden rounded-lg break-inside-avoid mb-4 transition-all duration-300 transform hover:scale-[1.02]">
          <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-video">
            {!imageError ? (
              <>
                <Image
                  src={photo.imageUrl}
                  alt={photo.alt}
                  fill
                  className={`object-cover transition-transform duration-300 group-hover:scale-110 rounded-lg ${
                    isLoading ? "opacity-0" : "opacity-100"
                  }`}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setIsLoading(false);
                  }}
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
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
        <DialogTitle className="sr-only">
          {photo.title} - Photo Gallery
        </DialogTitle>
        <div className="relative bg-black rounded-lg overflow-hidden">
          <div className="relative aspect-auto max-h-[80vh] overflow-hidden">
            {!imageError ? (
              <Image
                src={photo.imageUrl}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-full object-contain"
                priority
              />
            ) : (
              <div className="w-full h-64 bg-gray-900 flex items-center justify-center text-white">
                <div className="text-center">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Image could not be loaded</p>
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="text-white">
              <h3 className="text-xl font-bold mb-2">{photo.title}</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`
                    ${
                      photo.category === "religious"
                        ? "bg-orange-600 text-white"
                        : ""
                    }
                    ${
                      photo.category === "social"
                        ? "bg-green-600 text-white"
                        : ""
                    }
                    ${
                      photo.category === "other" ? "bg-blue-600 text-white" : ""
                    }
                  `}
                >
                  {photo.category.charAt(0).toUpperCase() +
                    photo.category.slice(1)}
                </Badge>
                <span className="text-gray-300 text-sm">
                  {photo.width} × {photo.height}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PhotoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filteredPhotos = useMemo(() => {
    return getPhotosByCategory(activeCategory);
  }, [activeCategory]);

  const displayedPhotos = useMemo(() => {
    if (showAll) return filteredPhotos;

    const mobileLimit = 5;
    const desktopLimit = 17;

    return filteredPhotos.slice(0, desktopLimit);
  }, [filteredPhotos, showAll]);

  const handleCategoryChange = (category: string) => {
    if (category !== activeCategory) {
      setIsLoading(true);
      setActiveCategory(category);
      setShowAll(false);

      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const hasMorePhotos = filteredPhotos.length > 17;

  return (
    <div className="w-full">
      <Tabs
        value={activeCategory}
        onValueChange={handleCategoryChange}
        className="mb-8"
      >
        {/* <TabsList className="flex flex-wrap justify-center items-center gap-2 bg-transparent p-0 h-auto mx-auto max-w-4xl">
          {photoCategories.map((category) => (
            <TabsTrigger 
              key={category.key}
              value={category.key}
              className={`
                flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 border-0 shadow-sm
                ${category.key === 'all' ? 
                  'data-[state=active]:bg-gray-800 data-[state=active]:text-white bg-gray-100 text-gray-700 hover:bg-gray-200' : 
                  category.key === 'religious' ? 
                    'data-[state=active]:bg-purple-500 data-[state=active]:text-white bg-purple-50 text-purple-700 hover:bg-purple-100' :
                  category.key === 'social' ? 
                    'data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-blue-50 text-blue-700 hover:bg-blue-100' :
                    'data-[state=active]:bg-gray-600 data-[state=active]:text-white bg-gray-50 text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-base">{category.icon}</span>
              <span className="hidden sm:inline text-sm">{category.label}</span>
              <span className="sm:hidden text-sm">{category.key === 'all' ? 'All' : category.label.slice(0, 3)}</span>
            </TabsTrigger>
          ))}
        </TabsList> */}

        {/* {photoCategories.map((category) => (
          <TabsContent key={category.key} value={category.key} className="mt-0">
            
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-orange-600">{filteredPhotos.length}</span> photos
                {category.key !== 'all' && (
                  <span> in <span className="font-semibold">{category.label}</span> category</span>
                )}
              </p>
            </div>
          </TabsContent>
        ))} */}
      </Tabs>

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
