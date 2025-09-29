import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, CreditCard } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="py-16 lg:py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              दान करें - सेवा करें
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            राष्ट्र सेवा में योगदान करें
          </h1>
          <p className="text-lg lg:text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed mb-8">
            आपका हर योगदान समाज सेवा, शिक्षा और राष्ट्रीय एकता के कार्यों में उपयोग होता है
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-foreground/80" />
              <span>100% सुरक्षित भुगतान</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-foreground/80" />
              <span>त्वरित और आसान</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary-foreground/80" />
              <span>पारदर्शी उपयोग</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;