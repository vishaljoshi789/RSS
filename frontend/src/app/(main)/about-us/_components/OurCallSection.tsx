import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface OurCallSectionProps {
  ourCall: {
    title: string;
    points: string[];
    conclusion: string;
  };
}

const OurCallSection: React.FC<OurCallSectionProps> = ({ ourCall }) => {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
            {ourCall.title}
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-muted-foreground">आज समय है —</p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {ourCall.points.map((point, index) => (
            <Card key={index} className="p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">{point}</p>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-xl">
          <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">न दैन्यं न पलायनम्</h3>
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
              {ourCall.conclusion}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OurCallSection;