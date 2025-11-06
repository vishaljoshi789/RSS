"use client";

import Image from "next/image";
import { aboutData } from "./AboutInfo";
import NormalButton from "@/components/common/RssButton/RssButton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

const About = () => {
  return (
    <section className="bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 lg:mb-8">
          <div className="relative inline-block">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-2 relative pb-4">
              {aboutData.title}
              <Image
                src="/Svg/text/original-underline.svg"
                alt="decorative underline"
                width={200}
                height={20}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full max-w-[200px] h-auto animate-pulse"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
              />
            </h2>
          </div>
          <p className="text-lg text-gray-600 mt-4">{aboutData.subtitle}</p>
        </div>

        <div className="w-full grid lg:grid-cols-2 gap-4 lg:gap-8 mb-6 items-center">
          <div className="order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-full h-64 lg:h-80 rounded-lg overflow-hidden">
              <Image
                src={aboutData.image}
                alt={aboutData.imageAlt}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-contain w-full h-full hover:scale-105 transition-transform duration-500"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k="
              />
            </div>
          </div>

          <div className="order-2 lg:order-1 space-y-4 text-center lg:text-left flex flex-col justify-center">
            <div className="flex flex-col items-center lg:items-start">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                संगठन परिचय
              </h3>
              <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                {aboutData.content.description}
              </p>
            </div>

            <div className="pt-2 flex justify-center lg:justify-start">
              <NormalButton
                variant="primary"
                showArrow
                size="lg"
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-300"
              >
                <Link
                  href={aboutData.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Learn More
                </Link>
              </NormalButton>
            </div>
          </div>
        </div>

        <div className="relative w-full bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 py-12 px-6 lg:px-12 rounded-2xl shadow-lg border-2 border-orange-200 overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-300 rounded-full opacity-10 -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-400 rounded-full opacity-10 translate-x-20 translate-y-20"></div>

          <div className="absolute top-4 left-6 lg:left-12 text-6xl text-orange-300 opacity-50 font-serif leading-none">
            "
          </div>
          <div className="absolute bottom-4 right-6 lg:right-12 text-6xl text-orange-300 opacity-50 font-serif leading-none">
            "
          </div>

          <blockquote className="relative z-10 text-lg lg:text-2xl font-bold text-primary leading-relaxed text-center max-w-4xl mx-auto px-8 lg:px-16">
            {aboutData.content.quote}
          </blockquote>

          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent to-orange-400 rounded-full"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div className="w-12 h-1 bg-gradient-to-l from-transparent to-orange-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {aboutData.content.conclusion && (
          <div className="mt-12 relative">
            <div className="relative bg-white border-l-4 border-orange-500 shadow-xl rounded-r-2xl overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600"></div>

              <div className="py-8 px-6 lg:px-12">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-2">
                      Our Commitment
                    </h3>
                    <p className="text-base lg:text-lg text-gray-800 leading-relaxed font-medium">
                      {aboutData.content.conclusion}
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-100 rounded-tl-full opacity-30"></div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
