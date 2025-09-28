"use client";

import Image from "next/image";
import { aboutData } from "./AboutInfo";
import NormalButton from "@/components/common/RssButton/RssButton";
import Link from "next/link";

const About = () => {
  return (
    <section className="py-6 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="text-center mb-6 lg:mb-8">
          <div className="relative inline-block">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-2 relative">
              {aboutData.title}
              
              <svg
                viewBox="0 0 200 20"
                fill="none"
                className="absolute -bottom-2 left-0 w-full h-4"
              >
                <path
                  d="M10 15C50 8 90 8 130 15C150 18 170 18 190 15"
                  stroke="url(#about-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                
                <circle cx="15" cy="12" r="1.5" fill="#FF6B35" opacity="0.8" />
                <circle cx="100" cy="6" r="1" fill="#FF8C42" opacity="0.6" />
                <circle cx="185" cy="12" r="1.5" fill="#FF6B35" opacity="0.8" />
                
                <defs>
                  <linearGradient
                    id="about-gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#FF6B35" />
                    <stop offset="30%" stopColor="#FF8C42" />
                    <stop offset="70%" stopColor="#FFA726" />
                    <stop offset="100%" stopColor="#FF6B35" />
                  </linearGradient>
                </defs>
              </svg>
            </h2>
          </div>
          <p className="text-lg text-gray-600 mt-4">
            {aboutData.subtitle}
          </p>
        </div>

       
        <div className="w-full grid lg:grid-cols-2 gap-4 lg:gap-8 mb-6 items-center">
         
          <div className="order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden">
              <Image
                src={aboutData.image}
                alt={aboutData.imageAlt}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

         
          <div className="order-2 lg:order-1 space-y-4 text-center lg:text-left flex flex-col justify-center">
            <div className="flex flex-col items-center lg:items-start">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                संगठन परिचय
              </h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                {aboutData.content.description}
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-start">
              <h3 className="text-xl font-bold text-primary mb-3">
                हमारा मिशन
              </h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                {aboutData.content.mission}
              </p>
            </div>

            <div className="pt-2 flex justify-center lg:justify-start">
              <NormalButton
                variant="primary"
                size="lg"
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-300"
              >
                <Link
                  href={aboutData.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Learn More
                  
                </Link>
              </NormalButton>
            </div>
          </div>
        </div>

       
        <div className="w-full bg-gradient-to-r from-orange-50 to-orange-100 py-8 px-6 rounded-lg flex items-center justify-center border border-orange-200">
          <blockquote className="text-lg lg:text-xl font-bold text-primary leading-relaxed text-center max-w-4xl">
            {aboutData.content.quote}
          </blockquote>
        </div>

       
        {aboutData.content.conclusion && (
          <div className="mt-8 text-center">
            <p className="text-base lg:text-lg text-gray-700 italic leading-relaxed max-w-3xl mx-auto">
              {aboutData.content.conclusion}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;