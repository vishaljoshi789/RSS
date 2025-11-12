import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ब्लॉग | राष्ट्रीय सेवा संघ",
  description:
    "राष्ट्रीय सेवा संघ की गतिविधियों, समाचार और अपडेट के बारे में पढ़ें। समाज सेवा, राष्ट्र निर्माण और सांस्कृतिक कार्यक्रमों की जानकारी।",
  keywords: [
    "RSS blog",
    "राष्ट्रीय सेवा संघ ब्लॉग",
    "समाचार",
    "updates",
    "social service",
    "events",
  ],
  openGraph: {
    title: "ब्लॉग | राष्ट्रीय सेवा संघ",
    description:
      "राष्ट्रीय सेवा संघ की गतिविधियों और समाचार के बारे में पढ़ें",
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
