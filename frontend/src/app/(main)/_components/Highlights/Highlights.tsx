"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MapPin, Heart, Award, Target } from "lucide-react";
import {
  highlightsData,
  formatNumber,
  animationConfig,
  HighlightCounter,
} from "./HighlightsInfo";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

interface AnimatedCounterProps {
  counter: HighlightCounter;
  inView: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  counter,
  inView,
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = counter.value;
    const duration = counter.duration || animationConfig.duration;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCurrentValue(end);
        clearInterval(timer);
      } else {
        setCurrentValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, counter.value, counter.duration]);

  return (
    <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
      {counter.prefix}
      {formatNumber(currentValue)}
      {counter.suffix}
    </span>
  );
};

const getIcon = (iconName: string) => {
  const iconProps = { className: "w-6 h-6 text-white" };
  switch (iconName) {
    case "🗺️":
      return <MapPin {...iconProps} />;
    case "👥":
      return <Users {...iconProps} />;
    case "🙋‍♂️":
      return <Heart {...iconProps} />;
    default:
      return <Award {...iconProps} />;
  }
};

const getColorClasses = (color: string) => {
  switch (color) {
    case "orange":
      return "from-orange-500/90 to-orange-700/90";
    case "blue":
      return "from-blue-500/90 to-blue-700/90";
    case "green":
      return "from-green-500/90 to-green-700/90";
    case "purple":
      return "from-purple-500/90 to-purple-700/90";
    default:
      return "from-primary/90 to-primary/70";
  }
};

const Highlights = () => {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("highlights-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section
      id="highlights-section"
      className="py-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            हमारी उपलब्धियां
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {highlightsData.title}
          </h2>

          {highlightsData.subtitle && (
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {highlightsData.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlightsData.counters.map((counter, index) => (
            <Card
              key={counter.id}
              className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="absolute inset-0">
                <Image
                  src={counter.backgroundImage || "/placeholder-image.jpg"}
                  alt={counter.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                />

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(
                    counter.color || "orange"
                  )} opacity-85 group-hover:opacity-90 transition-opacity duration-300`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-full">
                    {getIcon(counter.icon || "🎯")}
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Target className="w-3.5 h-3.5 text-white/80" />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <AnimatedCounter counter={counter} inView={inView} />
                </div>

                <div className="text-center">
                  <h3 className="text-base md:text-lg font-bold text-white leading-tight drop-shadow-md">
                    {counter.title}
                  </h3>

                  <div className="w-12 h-0.5 bg-white/50 mx-auto mt-3 rounded-full" />
                </div>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              आपकी सहभागिता से बढ़ते आंकड़े
            </h3>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              राष्ट्रीय सेवा संघ की बढ़ती सफलता में आपका योगदान अमूल्य है। हमारे
              साथ जुड़कर इन आंकड़ों को और बेहतर बनाने में सहायता करें।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;
