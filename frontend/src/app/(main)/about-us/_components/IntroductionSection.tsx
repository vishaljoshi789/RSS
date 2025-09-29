import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl bg-gradient-to-br from-card to-muted/30">
          <CardContent className="p-6 sm:p-8 lg:p-16">
            <div className="text-center mb-8 sm:mb-12">
              <blockquote className="text-lg sm:text-xl lg:text-3xl font-bold text-foreground mb-6 sm:mb-8 leading-relaxed px-2">
                &ldquo;{introduction.mainQuote}&rdquo;
              </blockquote>
              <div className="justify-center hidden md:flex items-center mt-4 sm:mt-6 px-4">
                <Badge 
                  variant="secondary" 
                  className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-semibold flex items-center justify-center bg-primary/10 text-primary border-primary/20 rounded-lg shadow-sm max-w-full break-words text-center leading-tight"
                >
                  <span className="block sm:inline">स्थापना:</span>
                  <span className="block sm:inline sm:ml-1">{introduction.foundingDate}</span>
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6 text-center lg:text-justify">
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                <strong className="text-primary font-bold">राष्ट्रीय सेवा संघ भारतवर्ष</strong> {introduction.description}
              </p>
              <div className="bg-primary/5 border-l-4 border-primary p-4 sm:p-6 rounded-r-lg">
                <p className="text-primary font-semibold text-base sm:text-lg leading-relaxed">
                  राष्ट्रीय सेवा संघ का प्रत्येक धर्म रक्षक, वेद और उपनिषदों में निहित सनातन सत्य को आत्मसात कर, भारतवर्ष की एकता, अखंडता और सांस्कृतिक गरिमा की रक्षा हेतु पूर्ण समर्पण भाव से सेवा कार्य में संलग्न है।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default IntroductionSection;