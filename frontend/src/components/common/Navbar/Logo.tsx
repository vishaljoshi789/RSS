"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

const Logo = () => {
  const [currentLanguage, setCurrentLanguage] = useState(0);
  const languages = [
    "राष्ट्रीय सेवा संघ", // Hindi
    "RASHTRIYA SEVA SANGH", // English (Romanized)
    "રાષ્ટ્રીય સેવા સંઘ", // Gujarati
    "ರಾಷ್ಟ್ರೀಯ ಸೇವಾ ಸಂಘ", // Kannada
    "ராஷ்ட்ரிய சேவா சங்க்", // Tamil
    "రాష్ట్రీయ సేవా సంఘ్", // Telugu
    "ರಾಷ್ಟ್ರೀಯ സേവಾ സംഘം", // Malayalam
    "রাষ্ট্রীয় সেবা সংঘ", // Bengali
    "ਰਾਸ਼ਟਰੀ ਸੇਵਾ ਸੰਘ", // Punjabi
    "ରାଷ୍ଟ୍ରୀୟ ସେବା ସଂଘ", // Odia
    "राष्ट्रीय सेवा संघ (Nepali)", // Nepali (similar to Hindi)
    "راشٹریہ سیوا سنگھ", // Urdu
    "राष्ट्रीय सेवा संघ", // Marathi (same as Hindi)
    "জাতীয় সেবা সংঘ", // Assamese
    "राष्ट्रिय सेवा संघ", // Sanskrit
    "राष्ट्रीय सेवा संघ", // Maithili
    "رەشتریا سیوا سنگ", // Kashmiri (Perso-Arabic)
    "Rāṣṭrīya Sēvā Saṅgha", // Transliteration (IAST)
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLanguage((prev) => (prev + 1) % languages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [languages.length]);

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
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-orange-500 via-white to-green-600 bg-clip-text text-transparent whitespace-nowrap animate-tricolor-flow bg-[length:200%_100%]">
                RASHTRIYA SEVA SANGH
              </span>
            </span>
          </h1>
          <div className="relative h-4 sm:h-5 overflow-hidden mt-0.5">
            {languages.map((lang, index) => (
              <p
                key={index}
                className={`font-nunito text-[10px] text-gray-600 tracking-tight absolute inset-0 transition-all duration-700 ${
                  currentLanguage === index
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                {lang}
              </p>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Logo;
