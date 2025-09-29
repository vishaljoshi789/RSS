import React from "react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Authentication - RSS Rashtriya Swayamsevak Sangh",
  description:
    "Login or Register to join the RSS community and contribute to nation building",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />

        <div className="relative z-10 flex flex-col justify-center px-8 py-12">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <div className="relative h-14 w-14">
                  <Image
                    src="/logo/logo.png"
                    alt="राष्ट्रीय सेवा संघ Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold">राष्ट्रीय स्वयंसेवक संघ</h1>
                <p className="text-xs text-primary-foreground/80">
                  Rashtriya Swayamsevak Sangh
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
              राष्ट्र सेवा में योगदान करें
            </h2>
            <p className="text-primary-foreground/90 text-sm leading-relaxed max-w-md">
              हमारे साथ जुड़ें और भारतीय संस्कृति, मूल्यों और परंपराओं के
              संरक्षण में अपना योगदान दें।
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                <span>चरित्र निर्माण और आध्यात्मिक विकास</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                <span>सामाजिक सेवा और राष्ट्रीय एकता</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                <span>संस्कृति संरक्षण और शिक्षा</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                <span>युवा प्रशिक्षण और मार्गदर्शन</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-primary-foreground/10 rounded-lg border border-primary-foreground/20">
            <blockquote className="text-sm italic text-primary-foreground/90">
              &ldquo;संगठन शक्ति कलियुगे&rdquo;
            </blockquote>
            <cite className="text-xs text-primary-foreground/70 mt-1 block">
              - संगठन ही कलियुग में शक्ति है
            </cite>
          </div>
        </div>
      </div>

      {/* Right Panel - Full width on mobile */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 lg:p-6 min-h-screen">
        <div className="w-full max-w-2xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
