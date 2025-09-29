import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Founders & Team Members | Rashtriya Seva Sangh",
  description: "Meet our dedicated leadership team and state coordinators who work tirelessly for the betterment of society through Rashtriya Seva Sangh. संस्थापक एवं टीम सदस्य",
  keywords: [
    "RSS founders",
    "team members", 
    "leadership",
    "संस्थापक",
    "टीम सदस्य",
    "राष्ट्रीय सेवा संघ",
    "organization leaders",
    "state coordinators"
  ],
  openGraph: {
    title: "Founders & Team Members | Rashtriya Seva Sangh",
    description: "Meet our dedicated leadership team and state coordinators working for society's betterment.",
    type: "website",
    locale: "hi_IN",
  },
  alternates: {
    canonical: "/founders-team-members",
  },
};

interface LayoutProps {
  children: React.ReactNode;
}

const FoundersTeamLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="relative pt-14">
        {children}
      </main>
    </div>
  );
};

export default FoundersTeamLayout;
