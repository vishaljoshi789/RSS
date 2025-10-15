import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, CreditCard, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      {/* Decorative SVG Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute -top-10 -right-10 w-64 h-64 text-white/5" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M45.1,-55.4C59.6,-45.7,73.4,-32.7,77.9,-17.1C82.4,-1.5,77.6,16.7,68.3,31.3C59,45.9,45.2,56.9,29.8,62.3C14.4,67.7,-2.6,67.5,-18.7,62.6C-34.8,57.7,-50,48.1,-59.7,34.4C-69.4,20.7,-73.6,3,-70.3,-13.2C-67,-29.4,-56.2,-44.1,-42.5,-54C-28.8,-63.9,-12.2,-68.9,2.5,-72C17.2,-75.1,30.6,-65.1,45.1,-55.4Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute -bottom-10 -left-10 w-72 h-72 text-white/5" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M39.5,-62.4C51.1,-54.7,60.3,-43.1,66.8,-29.9C73.3,-16.7,77.1,-1.9,75.4,12.3C73.7,26.5,66.5,40.1,56,49.9C45.5,59.7,31.7,65.7,17.3,68.3C2.9,70.9,-12.1,70.1,-25.3,65.1C-38.5,60.1,-50,50.9,-58.4,38.9C-66.8,26.9,-72.1,12.1,-71.9,-2.8C-71.7,-17.7,-66,-32.8,-56.6,-43.7C-47.2,-54.6,-34.1,-61.3,-20.8,-67.1C-7.5,-72.9,5.9,-77.8,18.9,-76.5C31.9,-75.2,27.9,-70.1,39.5,-62.4Z" transform="translate(100 100)" />
        </svg>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center">
          <Badge className="mb-6 px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 mr-1.5" />
            दान करें - सेवा करें
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
            राष्ट्र सेवा में योगदान करें
          </h1>
          
          <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed mb-10">
            आपका हर योगदान समाज सेवा, शिक्षा और राष्ट्रीय एकता के कार्यों में उपयोग होता है।
            एक बेहतर समाज के निर्माण में अपना योगदान दें।
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <Shield className="w-4 h-4 text-white/90" />
              <span className="font-medium text-white">सुरक्षित भुगतान</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <CreditCard className="w-4 h-4 text-white/90" />
              <span className="font-medium text-white">त्वरित और आसान</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <Heart className="w-4 h-4 text-white/90" />
              <span className="font-medium text-white">पारदर्शी उपयोग</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-8 sm:h-12 text-background" preserveAspectRatio="none" viewBox="0 0 1200 120">
          <path d="M0,0 C150,80 350,80 600,60 C850,40 1050,40 1200,80 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;