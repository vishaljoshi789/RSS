import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

interface PrimaryImageSectionProps {
  image: {
    url: string;
    alt: string;
  };
}

const PrimaryImageSection: React.FC<PrimaryImageSectionProps> = ({ image }) => {
  return (
    <section className="py-6 sm:py-10 lg:py-12 mt-6 sm:-mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border">
          <Image
            src={image.url}
            alt={image.alt}
            width={2048}
            height={1279}
            className="w-full h-[250px] sm:h-[350px] lg:h-[550px] object-contain"
            priority
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        </Card>
      </div>
    </section>
  );
};

export default PrimaryImageSection;
