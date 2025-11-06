"use client";

import React from "react";
import Image from "next/image";
import { Card} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { 
  CheckCircle, 
  Flag, 
  Eye,
  Sparkles
} from "lucide-react";
import { 
  rssInfoData 
} from "./RssInfo";

const RssOverview = () => {
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
    <section className="py-12 lg:py-20 bg-gradient-to-b from-background via-primary/5 to-background" id="rss-overview">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* <div className="text-center mb-12 lg:mb-16">
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
        </div> */}
       

        
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

                    
                    <div className="order-first lg:order-last w-full">
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl bg-muted">
                        <Image
                          src={tab.image}
                          alt={tab.title}
                          fill
                          sizes="(max-width: 1023px) 100vw, 50vw"
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k="
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

        
      
      </div>
    </section>
  );
};

export default RssOverview;