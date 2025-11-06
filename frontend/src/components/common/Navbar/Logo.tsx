import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

const Logo = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/"
        className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm"
        aria-label="राष्ट्रीय स्वयंसेवक संघ - Home"
      >
        <div className="relative h-14 w-14 flex-shrink-0">
          <Image
            src="/logo/logo.png"
            alt="राष्ट्रीय स्वयंसेवक संघ Logo"
            fill
            className="object-contain"
            priority
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
          />
        </div>
        <div className="block">
          <h1 className="font-lato font-bold text-sm sm:text-base lg:text-lg xl:text-lg leading-tight">
            <span className="bg-gradient-to-r from-orange-500 via-gray-400 to-green-600 bg-clip-text text-transparent">
              RASHTRIYA SEVA SANGH
            </span>
          </h1>
          <p className="font-nunito text-[5px] sm:text-xs text-gray-600 mt-0.5 hidden sm:block tracking-tighter">
            United for Dharma, Dedicated for Nation.
          </p>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
