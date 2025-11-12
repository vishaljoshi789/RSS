import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Divine Mission - Rashtriya Seva Sangh",
  description: "समाज सेवा, धर्म रक्षा और राष्ट्र निर्माण के लिए राष्ट्रीय सेवा संघ के पवित्र मिशन। जानें हमारे सभी सेवा कार्यक्रमों के बारे में।",
  keywords: "divine mission, social service, rashtriya seva sangh, धर्म रक्षा, समाज सेवा, गौमाता रक्षा, महिला सशक्तिकरण",
};

export default function DivineMissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}