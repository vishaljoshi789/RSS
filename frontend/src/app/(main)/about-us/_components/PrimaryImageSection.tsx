import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface PrimaryImageSectionProps {
  image: {
    url: string;
    alt: string;
  };
}

const PrimaryImageSection: React.FC<PrimaryImageSectionProps> = ({ image }) => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 mt-8 sm:-mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <Image
            src={image.url}
            alt={image.alt}
            width={2048}
            height={1279}
            className="w-full h-[300px] sm:h-[400px] lg:h-[600px] object-contain"
            priority
          />
        </Card>
      </div>
    </section>
  );
};

export default PrimaryImageSection;