import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  mainTitle: string;
  subtitle?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  mainTitle, 
  subtitle 
}) => {
  return (
    <section className="py-12 sm:py-16 lg:py-28 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6 sm:mb-8">
          <Badge variant="secondary" className="bg-primary-foreground/20 text-secondary border-primary-foreground/30 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 inline-flex items-center">
            राष्ट्रीय सेवा संघ भारतवर्ष
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight px-2">
          {mainTitle}
        </h1>
        {subtitle && (
          <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed px-4">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;