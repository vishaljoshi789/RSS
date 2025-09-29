import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import NormalButton from '@/components/common/RssButton/RssButton';

interface FinalCTASectionProps {
  finalMessage: string;
}

const FinalCTASection: React.FC<FinalCTASectionProps> = ({ finalMessage }) => {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-2xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <CardContent className="p-6 sm:p-8 lg:p-16 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4 sm:mb-8">
                <div className="text-4xl sm:text-6xl lg:text-8xl font-bold text-primary-foreground/20 mb-2 sm:mb-4">&ldquo;</div>
              </div>
              <h2 className="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
                {finalMessage}
              </h2>
              <div className="mb-4 sm:mb-8">
                <div className="text-4xl sm:text-6xl lg:text-8xl font-bold text-primary-foreground/20 rotate-180">&rdquo;</div>
              </div>
              <div className="border-t border-primary-foreground/20 pt-4 sm:pt-6 lg:pt-8">
                <p className="text-sm sm:text-base lg:text-xl text-primary-foreground/90 leading-relaxed mb-4 sm:mb-6 lg:mb-8">
                  हमारे साथ जुड़कर भारत के उज्ज्वल भविष्य का निर्माण करें। सेवा, समर्पण और संकल्प के साथ।
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                  <Link href="/contact">
                    <NormalButton 
                      variant="secondary" 
                      size="lg" 
                      className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
                    >
                      संपर्क करें
                    </NormalButton>
                  </Link>
                  <Link href="/#donation">
                    <NormalButton 
                      variant="outline" 
                      size="lg" 
                      className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
                    >
                      दान करें
                    </NormalButton>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FinalCTASection;