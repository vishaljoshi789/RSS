import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

const CommunityServiceSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              समाज सेवा और रक्तदान
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                हमारा संगठन नियमित रूप से रक्तदान शिविर आयोजित करता है। यह हमारी सेवा भावना का प्रत्यक्ष प्रमाण है।
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                रक्तदान जीवनदान है - यह सिद्धांत हमारे हर सदस्य के हृदय में बसा है। हम समाज की सेवा के लिए हमेशा तत्पर रहते हैं।
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                आपातकाल में, प्राकृतिक आपदाओं में, या किसी भी समय जब समाज को हमारी आवश्यकता होती है, हम तत्काल सेवा के लिए उपस्थित होते हैं।
              </p>
            </div>
          </div>
          <div>
            <Card className="overflow-hidden border">
              <Image
                src="https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-01-at-10.08.01-PM-scaled.jpeg"
                alt="Blood Donation Camp - Community Service"
                width={1200}
                height={800}
                className="w-full h-[250px] sm:h-[350px] lg:h-[450px] object-cover"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityServiceSection;