"use client";

import React from "react";
import Image from "next/image";
import { Quote, MapPin } from "lucide-react";
import { testimonialsData } from "./TestimonialsData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Testimonials = () => {
  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4 lg:mb-6">
            <Quote className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            <span className="text-sm lg:text-base text-primary font-semibold">
              प्रशंसापत्र
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">
            What People <span className="text-primary">Say</span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hear from our members and supporters about their experiences and journey with us.
          </p>
        </div>

        {/* Swiper for All Devices */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 32,
              },
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            className="testimonials-swiper pb-12"
          >
            {testimonialsData.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="group relative bg-background border border-border rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                  {/* Quote Icon */}
                  <div className="absolute top-4 lg:top-6 right-4 lg:right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-12 h-12 lg:w-16 lg:h-16 text-primary" />
                  </div>

                  {/* Profile Section */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-base lg:text-lg truncate">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {testimonial.role}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{testimonial.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="relative z-10">
                    <p className="text-sm lg:text-base text-muted-foreground leading-relaxed mb-4">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground/70 italic leading-relaxed">
                      &quot;{testimonial.quoteHindi}&quot;
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .testimonials-swiper .swiper-pagination-bullet {
          background: hsl(var(--primary));
          opacity: 0.3;
        }
        .testimonials-swiper .swiper-pagination-bullet-active {
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
