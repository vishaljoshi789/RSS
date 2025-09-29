import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WhyDifferentSectionProps {
  whyDifferent: {
    title: string;
    motto: string;
    content: string[];
  };
}

const WhyDifferentSection: React.FC<WhyDifferentSectionProps> = ({ whyDifferent }) => {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl bg-gradient-to-br from-card to-muted/30">
          <CardContent className="p-6 sm:p-8 lg:p-16">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">
                {whyDifferent.title}
              </h2>
              <div className="flex justify-center">
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-bold inline-flex items-center whitespace-nowrap">
                  {whyDifferent.motto}
                </Badge>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {whyDifferent.content.map((item, index) => (
                <Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item}</p>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <div className="overflow-hidden max-w-4xl mx-auto">
                <Image
                  src="https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-05-at-3.03.54-PM-scaled.webp"
                  alt="Religious Community Gathering"
                  width={1200}
                  height={800}
                  className="w-full h-[250px] sm:h-[350px] lg:h-[500px] object-contain"
                />
              </div>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                हमारे संगठन में सभी आयु वर्ग के लोग शामिल हैं। हम जाति, वर्ग की सीमाओं से ऊपर उठकर एक साथ काम करते हैं।
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhyDifferentSection;