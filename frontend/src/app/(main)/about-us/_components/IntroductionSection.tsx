import React from 'react';
import { Badge } from '@/components/ui/badge';

interface IntroductionSectionProps {
  introduction: {
    mainQuote: string;
    foundingDate: string;
    description: string;
  };
}

const IntroductionSection: React.FC<IntroductionSectionProps> = ({ introduction }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30 relative">
     
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-gray-200 bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden rounded-2xl shadow-xl">
          <div className="relative z-10 p-6 sm:p-10 lg:p-16">
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                प्रस्तावना
              </div>
              
              <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto">
                <span className="text-primary">&ldquo;</span>
                {introduction.mainQuote}
                <span className="text-primary">&rdquo;</span>
              </blockquote>
              
              <div className="flex justify-center overflow-hidden">
                <div className="flex w-max animate-marquee whitespace-nowrap">
                  <div className="flex items-center">
                    <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border-primary/30 px-5 py-2.5 text-sm font-semibold rounded-lg mx-4">
                      <span className="font-bold text-primary">स्थापना:</span>
                      <span className="ml-2">{introduction.foundingDate}</span>
                    </Badge>
                    <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border-primary/30 px-5 py-2.5 text-sm font-semibold rounded-lg mx-4">
                      <span className="font-bold text-primary">स्थापना:</span>
                      <span className="ml-2">{introduction.foundingDate}</span>
                    </Badge>
                    <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border-primary/30 px-5 py-2.5 text-sm font-semibold rounded-lg mx-4">
                      <span className="font-bold text-primary">स्थापना:</span>
                      <span className="ml-2">{introduction.foundingDate}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center" aria-hidden>
                    <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border-primary/30 px-5 py-2.5 text-sm font-semibold rounded-lg mx-4">
                      <span className="font-bold text-primary">स्थापना:</span>
                      <span className="ml-2">{introduction.foundingDate}</span>
                    </Badge>
                    <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border-primary/30 px-5 py-2.5 text-sm font-semibold rounded-lg mx-4">
                      <span className="font-bold text-primary">स्थापना:</span>
                      <span className="ml-2">{introduction.foundingDate}</span>
                    </Badge>
                    <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border-primary/30 px-5 py-2.5 text-sm font-semibold rounded-lg mx-4">
                      <span className="font-bold text-primary">स्थापना:</span>
                      <span className="ml-2">{introduction.foundingDate}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-background to-muted/50 p-6 rounded-xl border border-border/50">
                <p className="text-base sm:text-lg leading-relaxed text-muted-foreground text-justify lg:text-justify">
                  <strong className="text-primary font-bold text-lg">राष्ट्रीय सेवा संघ भारतवर्ष</strong> {introduction.description}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
                <p className="text-primary font-semibold text-base text-justify sm:text-lg leading-relaxed lg:text-justify">
                  राष्ट्रीय सेवा संघ का प्रत्येक धर्म रक्षक, वेद और उपनिषदों में निहित सनातन सत्य को आत्मसात कर, भारतवर्ष की एकता, अखंडता और सांस्कृतिक गरिमा की रक्षा हेतु पूर्ण समर्पण भाव से सेवा कार्य में संलग्न है।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;