import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import NormalButton from '@/components/common/RssButton/RssButton';

interface FinalCTASectionProps {
  finalMessage: string;
}

const FinalCTASection: React.FC<FinalCTASectionProps> = ({ finalMessage }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"></div>
          
          <CardContent className="relative z-10 p-6 sm:p-12 lg:p-16 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold mb-8">
                आमंत्रण
              </div>
              
              <div className="mb-6">
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground/20 mb-3">&ldquo;</div>
              </div>
              
              <h2 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold mb-6 lg:mb-8 leading-tight text-primary-foreground">
                {finalMessage}
              </h2>
              
              <div className="mb-6">
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-foreground/20 rotate-180">&rdquo;</div>
              </div>
              
              <div className="border-t border-primary-foreground/30 pt-6 lg:pt-8">
                <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 leading-relaxed mb-8 max-w-3xl mx-auto">
                  हमारे साथ जुड़कर भारत के उज्ज्वल भविष्य का निर्माण करें। सेवा, समर्पण और संकल्प के साथ।
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact-us">
                    <NormalButton 
                      variant="secondary" 
                      size="lg" 
                      className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold px-8 py-3 text-base rounded-lg w-full sm:w-auto"
                    >
                      संपर्क करें
                    </NormalButton>
                  </Link>
                  <Link href="/donate-now">
                    <NormalButton 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary backdrop-blur-sm font-bold px-8 py-3 text-base rounded-lg w-full sm:w-auto"
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