"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  galleryPageContent,
  photoCategories, 
  videoCategories,
  getPhotosByCategory,
  getVideosByCategory,
  formatDate,
  type PhotoItem,
  type VideoItem
} from './gallery';
import { Play, Calendar, MapPin, Eye, Filter } from 'lucide-react';

const GalleryPage = () => {
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState('all');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const filteredPhotos = getPhotosByCategory(selectedPhotoCategory);
  const filteredVideos = getVideosByCategory(selectedVideoCategory);

  return (
    <div className="min-h-screen bg-background">
      
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-8">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 px-4 py-2">
              फोटो और वीडियो संग्रह
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            {galleryPageContent.title}
          </h1>
          <p className="text-lg lg:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed mb-8">
            {galleryPageContent.description}
          </p>
        </div>
      </section>

      
      <section className="py-12 lg:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground mx-auto mb-8">
              <TabsTrigger
                value="photos"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2"
              >
                📸 फोटो गैलरी
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2"
              >
                🎬 वीडियो गैलरी
              </TabsTrigger>
            </TabsList>

            
            <TabsContent value="photos" className="space-y-8">
              
              <div className="flex justify-center">
                <Card className="p-6 bg-card backdrop-blur-sm border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">
                      श्रेणी चुनें:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {photoCategories.map((category) => (
                      <Button
                        key={category.key}
                        variant={selectedPhotoCategory === category.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPhotoCategory(category.key)}
                        className={`${
                          selectedPhotoCategory === category.key 
                            ? "bg-primary text-secondary hover:bg-primary/90" 
                            : "border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPhotos.map((photo) => (
                  <Card
                    key={photo.id}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-card border border-border backdrop-blur-sm overflow-hidden"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <div className="relative aspect-square p-3">
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                          src={photo.imageUrl}
                          alt={photo.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-3 left-3 right-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-center gap-2 text-primary-foreground">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-medium">देखें</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <figure>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {photo.title}
                        </h3>
                        <figcaption className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {photo.caption}
                        </figcaption>
                      </figure>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {photo.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(photo.date)}</span>
                          </div>
                        )}
                        {photo.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{photo.location}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPhotos.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">📸</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    इस श्रेणी में कोई फोटो नहीं मिली
                  </h3>
                  <p className="text-muted-foreground">
                    कृपया दूसरी श्रेणी का चयन करें
                  </p>
                </div>
              )}
            </TabsContent>

            
            <TabsContent value="videos" className="space-y-8">
              
              <div className="flex justify-center">
                <Card className="p-6 bg-card backdrop-blur-sm border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">
                      श्रेणी चुनें:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {videoCategories.map((category) => (
                      <Button
                        key={category.key}
                        variant={selectedVideoCategory === category.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedVideoCategory(category.key)}
                        className={`${
                          selectedVideoCategory === category.key 
                            ? "bg-primary text-secondary hover:bg-primary/90" 
                            : "border-border text-foreground hover:bg-accent"
                        }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </Card>
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-card border border-border backdrop-blur-sm overflow-hidden"
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="relative aspect-video p-3">
                      <div className="relative w-full h-full rounded-lg overflow-hidden">
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/60 transition-colors duration-300 flex items-center justify-center">
                          <div className="bg-background/90 rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                            <Play className="w-8 h-8 text-primary fill-primary" />
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <figure>
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <figcaption className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {video.caption}
                        </figcaption>
                      </figure>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(video.uploadDate)}</span>
                        </div>
                        {video.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{video.location}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredVideos.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">🎬</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    इस श्रेणी में कोई वीडियो नहीं मिला
                  </h3>
                  <p className="text-muted-foreground">
                    कृपया दूसरी श्रेणी का चयन करें
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-background text-foreground border-primary-foreground/30">
          {selectedPhoto && (
            <>
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-xl font-bold text-foreground">
                  {selectedPhoto.title}
                </DialogTitle>
              </DialogHeader>
              <div className="px-6">
                <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 896px) 100vw, 896px"
                  />
                </div>
                <figure className="mb-6">
                  <figcaption className="text-foreground/80 leading-relaxed mb-4">
                    {selectedPhoto.caption}
                  </figcaption>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                    {selectedPhoto.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(selectedPhoto.date)}</span>
                      </div>
                    )}
                    {selectedPhoto.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedPhoto.location}</span>
                      </div>
                    )}
                  </div>
                </figure>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-background text-foreground border-primary-foreground/30">
          {selectedVideo && (
            <>
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-xl font-bold text-foreground">
                  {selectedVideo.title}
                </DialogTitle>
              </DialogHeader>
              <div className="px-6">
                <div className="relative aspect-video mb-6 rounded-lg overflow-hidden bg-foreground/10">
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
                <figure className="mb-6">
                  <figcaption className="text-foreground/80 leading-relaxed mb-4">
                    {selectedVideo.caption}
                  </figcaption>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                    <div className="flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      <span>{selectedVideo.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedVideo.uploadDate)}</span>
                    </div>
                    {selectedVideo.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedVideo.location}</span>
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
