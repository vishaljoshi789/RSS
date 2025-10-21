"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import useAxios from "@/hooks/use-axios";
import "swiper/css";

interface Ad {
  id: number;
  title: string;
  description: string;
  image: string;
  vyapari: number;
  ad_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface AdsProps {
  selectedCategory?: string;
  selectedState?: string;
  selectedDistrict?: string;
  selectedMarket?: string;
}

export const Ads: React.FC<AdsProps> = ({
  selectedCategory,
  selectedState,
  selectedDistrict,
  selectedMarket,
}) => {
  const axios = useAxios();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveAds();
  }, [selectedCategory, selectedState, selectedDistrict, selectedMarket]);

  const fetchActiveAds = async () => {
    try {
      const params = new URLSearchParams();

      if (selectedMarket && selectedMarket !== "all") {
        params.append("type", "market");
      } else if (selectedDistrict && selectedDistrict !== "all") {
        params.append("type", "district");
      } else if (selectedState && selectedState !== "all") {
        params.append("type", "state");
      } else if (selectedCategory && selectedCategory !== "all") {
        params.append("type", "category");
      } else {
        params.append("type", "global");
      }

      const response = await axios.get(
        `/vyapari/advertisement/?${params.toString()}`
      );
      const allAds = response.data.results || response.data || [];

      const today = new Date();
      const activeAds = allAds.filter((ad: Ad) => {
        if (!ad.is_active) return false;
        const startDate = new Date(ad.start_date);
        const endDate = new Date(ad.end_date);
        return today >= startDate && today <= endDate;
      });

      setAds(activeAds);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = (ad: Ad) => {
    console.log(`Ad clicked: ${ad.title}`);
  };

  if (loading || ads.length === 0) {
    return null;
  }

  const shouldLoop = ads.length >= 3;
  const displayAds = shouldLoop ? [...ads, ...ads, ...ads] : ads;

  return (
    <div className="w-full py-4">
      <Swiper
        modules={[Autoplay, FreeMode]}
        spaceBetween={16}
        slidesPerView="auto"
        freeMode={true}
        loop={shouldLoop}
        loopAdditionalSlides={shouldLoop ? 2 : 0}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={800}
        className="!overflow-visible"
      >
        {displayAds.map((ad, index) => (
          <SwiperSlide
            key={`${ad.id}-${index}`}
            className="!w-[320px] sm:!w-[400px]"
          >
            <div
              className="relative cursor-pointer group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              style={{ aspectRatio: "16/9" }}
              onClick={() => handleAdClick(ad)}
            >
              <Image
                src={ad.image}
                alt={ad.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 320px, 400px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-lg font-semibold drop-shadow-lg line-clamp-2">
                  {ad.title}
                </h3>
                {ad.description && (
                  <p className="text-white/90 text-xs mt-1 line-clamp-1">
                    {ad.description}
                  </p>
                )}
              </div>

              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
                <span className="text-xs font-medium text-gray-800">Ad</span>
              </div>

              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded">
                <span className="text-xs font-medium text-gray-800">
                  {ad.ad_type}
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
