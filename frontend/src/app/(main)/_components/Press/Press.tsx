"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Newspaper,
  Calendar,
  Search,
  ExternalLink,
  Award,
  BookOpen,
  Monitor,
  Trophy,
} from "lucide-react";
import {
  pressCategories,
  getPressByCategory,
  formatPressDate,
  getRecentPress,
  PressItem,
} from "./PressData";
import { Button } from "@/components/ui/button";

interface PressCardProps {
  item: PressItem;
  index: number;
  layout?: "grid" | "masonry";
}

const PressCard: React.FC<PressCardProps> = ({
  item,
  index,
  layout = "grid",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [cardHeight, setCardHeight] = useState(320);

  useEffect(() => {
    if (layout === "masonry") {
      const variations = [280, 320, 360, 400, 320, 340];
      const height = variations[index % variations.length];
      setCardHeight(height);
    }
  }, [index, layout]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "newspaper":
        return <Newspaper className="w-4 h-4" />;
      case "magazine":
        return <BookOpen className="w-4 h-4" />;
      case "digital":
        return <Monitor className="w-4 h-4" />;
      case "award":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Newspaper className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "newspaper":
        return "bg-blue-500 text-white";
      case "magazine":
        return "bg-green-500 text-white";
      case "digital":
        return "bg-purple-500 text-white";
      case "award":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white border border-gray-200 overflow-hidden">
          <CardContent className="p-1">
            <div
              className="relative overflow-hidden"
              style={{
                height: layout === "masonry" ? `${cardHeight}px` : "240px",
              }}
            >
              {!imageError ? (
                <>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <Badge
                  className={`${getCategoryColor(
                    item.category
                  )} font-semibold shadow-lg`}
                >
                  <span className="flex items-center gap-1">
                    {getCategoryIcon(item.category)}
                    {item.category.charAt(0).toUpperCase() +
                      item.category.slice(1)}
                  </span>
                </Badge>
              </div>

              {/* External Link Icon */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 rounded-full p-2">
                  <ExternalLink className="w-4 h-4 text-gray-800" />
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatPressDate(item.publishDate)}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.publication}
                </Badge>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full p-0 bg-white">
        <DialogTitle className="sr-only">
          {item.title} - Press Coverage
        </DialogTitle>
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-contain bg-gray-100"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>

          <div className="p-6 bg-white">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <Badge className={`ml-4 ${getCategoryColor(item.category)}`}>
                <span className="flex items-center gap-1">
                  {getCategoryIcon(item.category)}
                  {item.category.charAt(0).toUpperCase() +
                    item.category.slice(1)}
                </span>
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatPressDate(item.publishDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Newspaper className="w-4 h-4" />
                <span>{item.publication}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Press: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [layout] = useState<"grid" | "masonry">("grid");

  const filteredPress = getPressByCategory(activeCategory);
  const recentPress = getRecentPress(3);

  return (
    <section
      className="py-16 px-4 md:px-6 lg:px-8 "
      id="press-release"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Press <span className="text-orange-600">Coverage</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our media coverage, press releases, and recognition in
            newspapers, magazines, and digital platforms showcasing our impact
            and achievements.
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-orange-600" />
            Recent Highlights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPress.map((item, index) => (
              <PressCard
                key={item.id}
                item={item}
                index={index}
                layout="grid"
              />
            ))}
          </div>

          <Button className="mt-3 flex items-center justify-center mx-auto">View All Highlights</Button>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-orange-600" />
            Press Archive
          </h3>

          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            {/* <TabsList className="flex flex-wrap justify-center items-center gap-2 bg-transparent p-0 h-auto mx-auto max-w-4xl mb-8">
              {pressCategories.map((category) => (
                <TabsTrigger 
                  key={category.key}
                  value={category.key}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 border-0 shadow-sm
                    ${category.key === 'all' ? 
                      'data-[state=active]:bg-gray-800 data-[state=active]:text-white bg-gray-100 text-gray-700 hover:bg-gray-200' : 
                      category.key === 'newspaper' ? 
                        'data-[state=active]:bg-blue-500 data-[state=active]:text-white bg-blue-50 text-blue-700 hover:bg-blue-100' :
                      category.key === 'magazine' ? 
                        'data-[state=active]:bg-green-500 data-[state=active]:text-white bg-green-50 text-green-700 hover:bg-green-100' :
                      category.key === 'digital' ? 
                        'data-[state=active]:bg-purple-500 data-[state=active]:text-white bg-purple-50 text-purple-700 hover:bg-purple-100' :
                        'data-[state=active]:bg-orange-500 data-[state=active]:text-white bg-orange-50 text-orange-700 hover:bg-orange-100'
                    }
                  `}
                >
                  <span className="text-base">{category.icon}</span>
                  <span className="text-sm">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList> */}

            
                <div
                  className={`
                  ${
                    layout === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6"
                  }
                `}
                >
                  {filteredPress.slice(0, 5).map((item, index) => (
                    <div
                      key={item.id}
                      className={
                        layout === "masonry" ? "break-inside-avoid mb-6" : ""
                      }
                    >
                      <PressCard item={item} index={index} layout={layout} />
                    </div>
                  ))}
                </div>

                {filteredPress.length === 0 && (
                  <div className="text-center py-16">
                    <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No articles found
                    </h3>
                    
                  </div>
                )}

                {filteredPress.length > 0 && <Button className="mt-3 flex items-center justify-center mx-auto">Load More</Button>}
            
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Press;
