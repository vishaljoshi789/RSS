"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NormalButton from "@/components/common/RssButton/RssButton";
import { 
  Play, 
  CheckCircle, 
  Flag, 
  Eye,
  Users,
  Target,
  Sparkles
} from "lucide-react";
import { 
  pageContent, 
  videoInfo, 
  rssInfoData 
} from "./RssInfo";

const RssOverview = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const getTabIcon = (iconName: string) => {
    switch (iconName) {
      case 'lotus':
        return <Eye className="w-5 h-5" />;
      case 'flag':
        return <Flag className="w-5 h-5" />;
      case 'dharma':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-12 lg:py-20 bg-background" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 lg:mb-16">
          <Badge variant="secondary" className="mb-6 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20">
            <Users className="w-4 h-4 mr-2" />
            {pageContent.organizationName}
          </Badge>
          
          <h1 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {pageContent.mainTitle}
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {pageContent.mainSubtitle}
          </p>
        </div>

        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 lg:mb-20">
          
          <Card className="p-6 lg:p-8 shadow-lg bg-card/50 backdrop-blur-sm border-0">
            <CardContent className="p-0 space-y-8">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
                  {pageContent.introSection.title}
                </h2>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed mb-8">
                  {pageContent.introSection.description}
                </p>
              </div>

              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <NormalButton 
                  variant="primary"
                  size="md" 
                  icon={Target}
                  showArrow={false}
                  className="px-6 py-2.5 font-semibold"
                >
                  {pageContent.introSection.joinButtonText}
                </NormalButton>
                
                <NormalButton 
                  variant="secondary"
                  size="md"
                  showArrow={true}
                  className="px-4 py-2.5 font-semibold"
                >
                  {pageContent.introSection.learnMoreButtonText}
                </NormalButton>
              </div>
            </CardContent>
          </Card>

          
          <div className="relative">
            <div 
              className="relative aspect-video bg-muted rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
              onClick={() => setIsVideoModalOpen(true)}
            >
              <Image
                src={videoInfo.posterSrc}
                alt={videoInfo.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-8 h-8 lg:w-10 lg:h-10 text-primary ml-1" fill="currentColor" />
                </div>
              </div>
              
              
              <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm p-4 rounded-xl border">
                <h3 className="font-semibold text-foreground mb-1">{videoInfo.title}</h3>
                <p className="text-sm text-muted-foreground">{videoInfo.duration}</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
              हमारे मूल सिद्धांत
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              जानें कि कैसे हमारे मूल्य, दृष्टिकोण और मिशन राष्ट्र निर्माण में योगदान देते हैं
            </p>
          </div>

          <Tabs defaultValue="vision" className="w-full max-w-6xl mx-auto">
            {/* Centered TabsList */}
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 w-full max-w-md bg-muted p-1 h-auto">
                {rssInfoData.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs sm:text-sm font-medium"
                  >
                    {getTabIcon(tab.icon)}
                    <span>{tab.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {rssInfoData.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <Card className="p-6 lg:p-8 shadow-lg bg-card">
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          {getTabIcon(tab.icon)}
                          <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                            {tab.title}
                          </h3>
                        </div>
                        <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                          {tab.content}
                        </p>
                      </div>

                      
                      <div className="space-y-3">
                        {tab.points.map((point, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                              {point}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    
                    <div className="order-first lg:order-last">
                      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                        <Image
                          src={tab.image}
                          alt={tab.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        
        {isVideoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
              
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                }}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ×
              </button>
              
              
              <video
                controls
                autoPlay
                className="w-full h-full"
                poster={videoInfo.posterSrc}
              >
                <source src={videoInfo.videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RssOverview;