"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PhotoGallery from './Photo/PhotoGallery';
import VideoGallery from './Video/VideoGallery';
import { Images, Play } from 'lucide-react';

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('photos');

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-orange-600">Gallery</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our visual journey through photos and videos showcasing our activities,
            events, and community engagement across different categories.
          </p>
        </div>

        
        <div className="relative">
          
          <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 to-green-200/30 rounded-3xl blur-3xl -z-10"></div>
          
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full"
              >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-gray-100 p-1 rounded-xl h-auto">
                <TabsTrigger 
                  value="photos" 
                  className="flex items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-sm font-semibold"
                >
                  <Images className="w-4 h-4" />
                  <span>Photos</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="videos" 
                  className="flex items-center gap-2 px-4 py-3 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all text-sm font-semibold"
                >
                  <Play className="w-4 h-4" />
                  <span>Videos</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="photos" className="mt-0">
                <PhotoGallery />
              </TabsContent>

              <TabsContent value="videos" className="mt-0">
                <VideoGallery />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        </div>
      </div>
    </section>
  );
};

export default Gallery;