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
    <section className="py-8 sm:py-12 lg:py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                {whoWeAre.title}
              </h2>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {whoWeAre.content.map((item, index) => (
                <Card key={index} className="p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item}</p>
                </Card>
              ))}
            </div>
          </div>
          <div className="relative order-first lg:order-last">
            <div className="overflow-hidden">
              <Image
                src="https://joinrss.org.in/wp-content/uploads/2025/06/Picsart_25-01-11_02-12-39-485.webp"
                alt="RSS Banner"
                width={1600}
                height={533}
                className="w-full h-[200px] sm:h-[250px] lg:h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;