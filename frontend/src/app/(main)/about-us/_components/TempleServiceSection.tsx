import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

const TempleServiceSection: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <Card className="overflow-hidden shadow-xl">
              <Image
                src="https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.25-PM-e1756385010760.webp"
                alt="Temple Visit - Devotees at Temple"
                width={800}
                height={600}
                className="w-full h-[250px] sm:h-[350px] lg:h-[500px] object-cover"
              />
            </Card>
          </div>
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              धार्मिक आस्था और मंदिर सेवा
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                हमारे संगठन के सदस्य नियमित रूप से मंदिरों में जाकर प्रार्थना और सेवा करते हैं। यह हमारी आध्यात्मिक शक्ति का स्रोत है।
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                मंदिर केवल पूजा स्थल नहीं, बल्कि हमारी संस्कृति और परंपरा के संरक्षण का केंद्र हैं। हम मंदिरों की सुरक्षा और संरक्षण के लिए प्रतिबद्ध हैं।
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TempleServiceSection;