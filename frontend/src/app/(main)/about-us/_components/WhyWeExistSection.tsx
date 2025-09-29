import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface WhyWeExistSectionProps {
  whyWeExist: {
    title: string;
    content: string[];
  };
}

const WhyWeExistSection: React.FC<WhyWeExistSectionProps> = ({ whyWeExist }) => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {whyWeExist.title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
            हमारे अस्तित्व का उद्देश्य और समाज के कल्याण के लिए हमारा दृष्टिकोण
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {whyWeExist.content.map((item, index) => (
            <Card key={index} className="p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item}</p>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-xl">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">हमारा संघर्ष</h3>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-base sm:text-lg">
                  हम उस अंधकार के विरुद्ध हैं जो हमारे धर्म को क्षीण कर रहा है।
                </p>
                <p className="text-base sm:text-lg">
                  हम उस अन्याय के विरुद्ध हैं जो हमारी बहनों, माताओं और मंदिरों पर हो रहा है।
                </p>
                <p className="text-base sm:text-lg">
                  हम उस विस्मृति के विरुद्ध हैं जो हमें हमारी संस्कृति, वेद, उपनिषद और गुरुकुलों से दूर ले जा रही है।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhyWeExistSection;