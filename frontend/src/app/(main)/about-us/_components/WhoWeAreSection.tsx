import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface WhoWeAreSectionProps {
  whoWeAre: {
    title: string;
    content: string[];
  };
}

const WhoWeAreSection: React.FC<WhoWeAreSectionProps> = ({ whoWeAre }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
                हमारे बारे में
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
                {whoWeAre.title}
              </h2>
            </div>
            
            <div className="space-y-4">
              {whoWeAre.content.map((item, index) => (
                <Card key={index} className="group p-5 sm:p-6 border bg-gradient-to-br from-background to-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="relative order-first lg:order-last">
            <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-muted/20 to-muted/10 p-6">
              <Image
                src="https://joinrss.org.in/wp-content/uploads/2025/06/Picsart_25-01-11_02-12-39-485.webp"
                alt="RSS Banner"
                width={1600}
                height={533}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;