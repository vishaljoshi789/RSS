"use client";

import Image from "next/image";
import { aboutData } from "./AboutInfo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NormalButton from "@/components/common/RssButton/RssButton";

const About = () => {
  return (
    <section className="bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 lg:mb-8">
          <div className="relative inline-block">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-2 relative pb-4">
              {/* {aboutData.title} */}
              <span className="text-black">About </span>
              <span className="text-red-600">Us</span>
              {/* <Image
                src="/Svg/text/gradient-underline.svg"
                alt="decorative underline"
                width={200}
                height={20}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full max-w-[200px] h-auto animate-pulse"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
              /> */}
            </h2>
          </div>
          {/* <p className="text-lg text-gray-600 mt-4">{aboutData.subtitle}</p> */}
        </div>

        <div className="w-full grid lg:grid-cols-2 gap-4 lg:gap-8 mb-6 items-center">
          <div className="order-1 lg:order-2 flex justify-center items-center">
            <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden">
              <Image
                src={aboutData.image}
                alt={aboutData.imageAlt}
                fill
                priority
                // sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover aspect-[3/2] w-full h-full hover:scale-105 transition-transform duration-500"
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
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <p className="text-sm lg:text-base font-bold text-primary text-justify leading-relaxed">
                    {aboutData.content.description[0]}
                  </p>
                </div>

                {aboutData.content.description.slice(1).map((para, index) => (
                  <p
                    key={index + 1}
                    className="text-sm lg:text-base text-gray-700 text-justify leading-relaxed"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Highlights Section */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {aboutData.highlights.map((highlight, index) => {
                const IconComponent =
                  iconMap[highlight.icon as keyof typeof iconMap];
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-md">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {highlight.text}
                    </p>
                  </div>
                );
              })}
            </div> */}

            <div className="flex hidden justify-center lg:justify-start">
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
                  {aboutData.ctaText}
                </Link>
              </NormalButton>
            </div>
            <div className="flex block justify-center lg:hidden">
              <Button
                variant="default"
                size="lg"
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all duration-300"
              >
                <Link
                  href={aboutData.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-3"
                >
                  {aboutData.ctaText}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="relative w-full bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 py-12 px-6 lg:px-12 rounded-2xl shadow-lg border-2 border-orange-200 overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-300 rounded-full opacity-10 -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-400 rounded-full opacity-10 translate-x-20 translate-y-20"></div>

          <div className="absolute top-4 left-6 lg:left-12 text-6xl text-orange-300 opacity-50 font-serif leading-none">
            &quot;
          </div>
          <div className="absolute bottom-4 right-6 lg:right-12 text-6xl text-orange-300 opacity-50 font-serif leading-none">
            &quot;
          </div>

          <blockquote className="relative z-10 text-lg lg:text-2xl font-bold text-primary leading-relaxed text-center max-w-4xl mx-auto px-2 lg:px-16">
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
                    <p className="text-base lg:text-lg text-gray-800 text-justify leading-relaxed font-medium">
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
