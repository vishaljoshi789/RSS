import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "व्यापारी पोर्टल - Business Directory | राष्ट्रीय सेवा संघ",
  description:
    "राष्ट्रीय सेवा संघ का व्यापारी पोर्टल - स्वदेशी व्यवसायों को बढ़ावा देने के लिए समर्पित मंच। अपने व्यवसाय को पंजीकृत करें और हमारे समुदाय से जुड़ें। Discover and connect with businesses committed to nation building and swadeshi values.",
  keywords: [
    "व्यापारी पोर्टल",
    "Vyapari Portal",
    "Business Directory",
    "स्वदेशी व्यवसाय",
    "Swadeshi Business",
    "Indian Businesses",
    "Business Listing",
    "राष्ट्रीय सेवा संघ व्यापारी",
    "RSS Business",
    "Local Business",
    "भारतीय व्यवसाय",
    "Small Business India",
    "Business Registration",
    "व्यापार निर्देशिका",
  ],
  openGraph: {
    title: "व्यापारी पोर्टल - Business Directory | राष्ट्रीय सेवा संघ",
    description:
      "राष्ट्रीय सेवा संघ का व्यापारी पोर्टल - स्वदेशी व्यवसायों को बढ़ावा देने के लिए समर्पित मंच। अपने व्यवसाय को पंजीकृत करें और हमारे समुदाय से जुड़ें।",
    url: "https://joinrss.org.in/vyapari",
    type: "website",
    images: [
      {
        url: "/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "व्यापारी पोर्टल - Vyapari Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "व्यापारी पोर्टल - Business Directory | राष्ट्रीय सेवा संघ",
    description:
      "राष्ट्रीय सेवा संघ का व्यापारी पोर्टल - स्वदेशी व्यवसायों को बढ़ावा देने के लिए समर्पित मंच। अपने व्यवसाय को पंजीकृत करें।",
    images: ["/logo/logo.png"],
  },
  alternates: {
    canonical: "https://joinrss.org.in/vyapari",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import VyapariHeader from "./_components/Header";
import VyapariFooter from "./_components/Footer";

const VyapariLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="min-h-screen flex flex-col">
      <VyapariHeader />
      <main className="flex-1 w-full pt-16">
        {children}
      </main>
      <VyapariFooter />
    </div>
  );
};

export default VyapariLayout;
