"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  galleryPageContent,
  photoCategories,
  videoCategories,
  getPhotosByCategory,
  getVideosByCategory,
  formatDate,
  type PhotoItem,
  type VideoItem,
} from "./gallery";
import { Play, Calendar, MapPin, Filter } from "lucide-react";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

const PDFPageFlip = dynamic(() => import("@/components/PDFPageFlip"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading PDF viewer...</p>
      </div>
    </div>
  ),
});

const GalleryPage = () => {
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState("all");
  const [selectedVideoCategory, setSelectedVideoCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const filteredPhotos = getPhotosByCategory(selectedPhotoCategory);
  const filteredVideos = getVideosByCategory(selectedVideoCategory);

  return (
    <div className="min-h-screen bg-background pt-10">
      <section className="relative">
        <div className="absolute inset-0 h-[18rem] sm:h-[23rem]">
          <Image
            src={galleryPageContent.heroImage.url}
            alt={galleryPageContent.heroImage.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background/95" />
        </div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-24 text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Badge
              variant="secondary"
              className="px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs bg-white/20 text-white border-white/30 backdrop-blur"
            >
              📸 फोटो और वीडियो संग्रह
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {galleryPageContent.title}
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-white/90 max-w-3xl mx-auto px-2">
            {galleryPageContent.description}
          </p>
        </div>
      </section>

      <section className="py-16 mt-12 sm:mt-20 lg:mt-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <Tabs defaultValue="photos" className="w-full">
            <div className="flex justify-center mb-6 sm:mb-8">
              <TabsList className="inline-flex h-10 sm:h-12 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground border">
                <TabsTrigger
                  value="photos"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  📸 <span className="hidden sm:inline ml-1">फोटो गैलरी</span>
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  🎬 <span className="hidden sm:inline ml-1">वीडियो गैलरी</span>
                </TabsTrigger>
                <TabsTrigger
                  value="books"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  📖{" "}
                  <span className="hidden sm:inline ml-1">पवित्र पुस्तकें</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="photos" className="space-y-8 sm:space-y-12">
              <div className="flex justify-center">
                <Card className="p-3 sm:p-4 md:p-6 border rounded-xl max-w-4xl w-full">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      श्रेणी चुनें
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 sm:gap-2">
                    {photoCategories.map((category) => (
                      <Button
                        key={category.key}
                        variant={
                          selectedPhotoCategory === category.key
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedPhotoCategory(category.key)}
                        className={`${
                          selectedPhotoCategory === category.key
                            ? "bg-primary text-primary-foreground"
                            : "border"
                        } h-auto py-1.5 sm:py-2 px-2 sm:px-3 flex-col gap-0.5 sm:gap-1`}
                      >
                        <span className="text-base sm:text-lg leading-none">
                          {category.icon}
                        </span>
                        <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">
                          {category.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredPhotos.map((photo) => (
                  <Card
                    key={photo.id}
                    className="cursor-pointer bg-card border rounded-xl overflow-hidden"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="relative aspect-video p-1">
                      <div className="relative w-full h-full">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.alt}
                          fill
                          className="object-cover rounded-md"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                        />
                      </div>
                    </div>
                    <CardContent className="p-2 sm:p-3">
                      <figure>
                        <h3 className="font-semibold text-foreground mb-1.5 sm:mb-2 line-clamp-2 text-sm sm:text-base leading-tight">
                          {photo.title}
                        </h3>
                        <figcaption className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3 leading-relaxed">
                          {photo.caption}
                        </figcaption>
                      </figure>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground flex-wrap">
                        {photo.date && (
                          <div className="flex items-center gap-1 border px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
                            <span className="font-medium text-[10px] sm:text-xs">
                              {formatDate(photo.date)}
                            </span>
                          </div>
                        )}
                        {photo.location && (
                          <div className="flex items-center gap-1 border px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
                            <span className="truncate font-medium text-[10px] sm:text-xs">
                              {photo.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPhotos.length === 0 && (
                <div className="text-center py-12 sm:py-16 px-4">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 opacity-60">
                    📸
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    इस श्रेणी में कोई फोटो नहीं मिली
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                    कृपया दूसरी श्रेणी का चयन करें या बाद में फिर से देखें
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="videos" className="space-y-8 sm:space-y-12">
              <div className="flex justify-center">
                <Card className="p-3 sm:p-4 md:p-6 border rounded-xl max-w-4xl w-full">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      श्रेणी चुनें
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 sm:gap-2">
                    {videoCategories.map((category) => (
                      <Button
                        key={category.key}
                        variant={
                          selectedVideoCategory === category.key
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedVideoCategory(category.key)}
                        className={`${
                          selectedVideoCategory === category.key
                            ? "bg-primary text-primary-foreground"
                            : "border"
                        } h-auto py-1.5 sm:py-2 px-2 sm:px-3 flex-col gap-0.5 sm:gap-1`}
                      >
                        <span className="text-base sm:text-lg leading-none">
                          {category.icon}
                        </span>
                        <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">
                          {category.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="cursor-pointer bg-card border rounded-xl overflow-hidden"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative aspect-video">
                      <div className="relative w-full h-full">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                        />
                        <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 bg-black/70 text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-2.5 sm:p-4">
                      <figure>
                        <h3 className="font-semibold text-foreground mb-1.5 sm:mb-2 line-clamp-2 text-sm sm:text-base leading-tight">
                          {video.title}
                        </h3>
                        <figcaption className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-2 sm:mb-3 leading-relaxed">
                          {video.caption}
                        </figcaption>
                      </figure>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1 border px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
                          <span className="font-medium text-[10px] sm:text-xs">
                            {formatDate(video.uploadDate)}
                          </span>
                        </div>
                        {video.location && (
                          <div className="flex items-center gap-1 border px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground" />
                            <span className="truncate font-medium text-[10px] sm:text-xs">
                              {video.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredVideos.length === 0 && (
                <div className="text-center py-12 sm:py-16 px-4">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 opacity-60">
                    🎬
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                    इस श्रेणी में कोई वीडियो नहीं मिला
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                    कृपया दूसरी श्रेणी का चयन करें या बाद में फिर से देखें
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="books" className="space-y-8 sm:space-y-12">
              <div className="max-w-7xl mx-auto">
                <Card className="overflow-hidden border rounded-xl">
                  <div className="p-4 sm:p-6 border-b bg-muted/50">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
                      📖 श्रीमद्भगवद्गीता
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                      पवित्र भगवद्गीता को पढ़ें और जीवन का सच्चा ज्ञान प्राप्त
                      करें। पृष्ठों को पलटने के लिए क्लिक करें या स्वाइप करें।
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-b from-background to-muted/20">
                    <PDFPageFlip
                      pdfUrl="/docs/bhagwat geeta.pdf"
                      width={600}
                      height={800}
                    />
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Dialog
        open={!!selectedPhoto}
        onOpenChange={() => setSelectedPhoto(null)}
      >
        <DialogContent className="max-w-5xl w-[calc(100%-2rem)] sm:w-full max-h-[95vh] p-0 bg-background text-foreground border rounded-xl overflow-hidden">
          {selectedPhoto && (
            <>
              <DialogHeader className="p-3 sm:p-4 md:p-6 pb-0 border-b">
                <DialogTitle className="text-base sm:text-lg md:text-xl font-semibold text-foreground pr-8">
                  {selectedPhoto.title}
                </DialogTitle>
              </DialogHeader>
              <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
                <div className="relative aspect-video mb-4 sm:mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1152px) 100vw, 1152px"
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                  />
                </div>
                <figure className="mb-6 sm:mb-8">
                  <figcaption className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                    {selectedPhoto.caption}
                  </figcaption>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    {selectedPhoto.date && (
                      <div className="flex items-center gap-1.5 sm:gap-2 border px-2 sm:px-3 py-1 sm:py-1.5 rounded-md">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatDate(selectedPhoto.date)}
                        </span>
                      </div>
                    )}
                    {selectedPhoto.location && (
                      <div className="flex items-center gap-1.5 sm:gap-2 border px-2 sm:px-3 py-1 sm:py-1.5 rounded-md">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {selectedPhoto.location}
                        </span>
                      </div>
                    )}
                  </div>
                </figure>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedVideo}
        onOpenChange={() => setSelectedVideo(null)}
      >
        <DialogContent className="max-w-5xl w-[calc(100%-2rem)] sm:w-full max-h-[95vh] p-0 bg-background text-foreground border rounded-xl overflow-hidden">
          {selectedVideo && (
            <>
              <DialogHeader className="p-3 sm:p-4 md:p-6 pb-0 border-b">
                <DialogTitle className="text-base sm:text-lg md:text-xl font-semibold text-foreground pr-8">
                  {selectedVideo.title}
                </DialogTitle>
              </DialogHeader>
              <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
                <div className="relative aspect-video mb-4 sm:mb-6 rounded-lg overflow-hidden">
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                <figure className="mb-4">
                  <figcaption className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                    {selectedVideo.caption}
                  </figcaption>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 sm:gap-2 border px-2 sm:px-3 py-1 sm:py-1.5 rounded-md">
                      <Play className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedVideo.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 border px-2 sm:px-3 py-1 sm:py-1.5 rounded-md">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatDate(selectedVideo.uploadDate)}
                      </span>
                    </div>
                    {selectedVideo.location && (
                      <div className="flex items-center gap-1.5 sm:gap-2 border px-2 sm:px-3 py-1 sm:py-1.5 rounded-md">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {selectedVideo.location}
                        </span>
                      </div>
                    )}
                  </div>
                </figure>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryPage;
