"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { 
  Play, 
  Clock, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Video as VideoIcon
} from 'lucide-react';
import { 
  videoCategories, 
  getVideosByCategory, 
  formatDuration,
  formatDate,
  VideoItem 
} from './Video';

interface VideoCardProps {
  video: VideoItem;
  index: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex-shrink-0 w-80">
          <CardContent className="p-0">
            
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              {!imageError ? (
                <>
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
                      isLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    sizes="320px"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setImageError(true);
                      setIsLoading(false);
                    }}
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
                    ${video.category === 'event' ? 'bg-blue-500/90 text-white' : ''}
                    ${video.category === 'training' ? 'bg-green-500/90 text-white' : ''}
                    ${video.category === 'ceremony' ? 'bg-purple-500/90 text-white' : ''}
                    ${video.category === 'other' ? 'bg-gray-500/90 text-white' : ''}
                    font-semibold shadow-lg backdrop-blur-sm
                  `}
                >
                  {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
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

      
      <DialogContent className="max-w-6xl w-full p-0 bg-transparent border-0">
        <DialogTitle className="sr-only">
          {video.title} - Video Player
        </DialogTitle>
        <div className="relative bg-black rounded-lg overflow-hidden">
          <div className="relative aspect-video">
            
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
            <div className="text-white">
              <h3 className="text-xl font-bold mb-2">{video.title}</h3>
              <p className="text-gray-200 mb-3">{video.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <Badge 
                  variant="secondary"
                  className={`
                    ${video.category === 'event' ? 'bg-blue-600 text-white' : ''}
                    ${video.category === 'training' ? 'bg-green-600 text-white' : ''}
                    ${video.category === 'ceremony' ? 'bg-purple-600 text-white' : ''}
                    ${video.category === 'other' ? 'bg-gray-600 text-white' : ''}
                  `}
                >
                  {video.category.charAt(0).toUpperCase() + video.category.slice(1)}
                </Badge>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(video.duration)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(video.uploadDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const VideoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const filteredVideos = useMemo(() => {
    return getVideosByCategory(activeCategory);
  }, [activeCategory]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 320; // Card width + gap
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      
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
      </div>

      
      <div className="text-center mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-orange-600">{filteredVideos.length}</span> videos
          {activeCategory !== 'all' && (
            <span> in <span className="font-semibold">{videoCategories.find(cat => cat.key === activeCategory)?.label}</span></span>
          )}
        </p>
      </div>

      
      <div className="relative">
        
        {filteredVideos.length > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
              onClick={() => handleScroll('left')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
              onClick={() => handleScroll('right')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-8 py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredVideos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </div>
      </div>

      
      {filteredVideos.length === 0 && (
        <div className="text-center py-16">
          <VideoIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-600">
            No videos available in the {activeCategory} category.
          </p>
        </div>
      )}

      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <VideoIcon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Video Integration Ready</h4>
            <p className="text-blue-700 text-sm">
              The video gallery structure is complete. When you provide the video details and URLs, 
              they will automatically appear in this horizontal scrolling layout with proper categorization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGallery;