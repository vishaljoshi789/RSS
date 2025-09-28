"use client";

import React from "react";
import Image from "next/image";
import { Quote, Star, Heart } from "lucide-react";
import { founderInfo } from "./FounderInfo";

const Founder = () => {
  return (
    <section className="py-12 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-full mb-4 lg:mb-6">
            <Star className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
            <span className="text-sm lg:text-base text-primary font-semibold">Leadership</span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">
            Meet Our Founder
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            The visionary behind our mission to serve the nation
          </p>
        </div>

        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 lg:mb-16">
          
          <div className="order-2 lg:order-1 flex justify-center">
            <div className="relative">
              <div className="relative w-72 h-80 lg:w-96 lg:h-[450px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl">
                <Image
                  src={founderInfo.photo}
                  alt={founderInfo.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              
              
              <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6 bg-background/95 backdrop-blur-md p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-border">
                <h3 className="text-lg lg:text-xl font-bold text-foreground">{founderInfo.name}</h3>
                <p className="text-sm lg:text-base text-primary font-medium">{founderInfo.designation}</p>
              </div>
            </div>
          </div>

          
          <div className="order-1 lg:order-2 space-y-6 lg:space-y-8 px-4 lg:px-0">
            
            <div className="text-center lg:text-left">
              <p className="text-xl lg:text-3xl font-bold text-primary mb-2">
                {founderInfo.greeting}
              </p>
              <h3 className="text-lg lg:text-2xl font-semibold text-foreground">
                {founderInfo.orgName}
              </h3>
            </div>

            
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-muted/50 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-border">
                <h4 className="text-base lg:text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  Our Mission
                </h4>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                  {founderInfo.description}
                </p>
              </div>

              <div className="bg-primary/5 p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-primary/20">
                <h4 className="text-base lg:text-lg font-semibold text-foreground mb-3">
                  Our Objective
                </h4>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                  {founderInfo.objective}
                </p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="relative mx-4 lg:mx-0">
          <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 p-6 lg:p-12 rounded-2xl lg:rounded-3xl border border-primary/20 relative overflow-hidden">
            
            <div className="absolute top-4 left-4 lg:top-6 lg:left-8 w-8 h-8 lg:w-12 lg:h-12 bg-primary/10 rounded-full" />
            <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-8 w-6 h-6 lg:w-8 lg:h-8 bg-primary/20 rounded-full" />
            
            <div className="relative flex flex-col items-center text-center">
              <Quote className="w-8 h-8 lg:w-12 lg:h-12 text-primary/40 mb-4 lg:mb-6" />
              <blockquote className="text-lg lg:text-2xl xl:text-3xl font-bold text-foreground leading-relaxed mb-6 lg:mb-8 max-w-4xl px-2">
                &ldquo;{founderInfo.quote}&rdquo;
              </blockquote>
              <cite className="text-base lg:text-lg text-primary font-semibold">
                - {founderInfo.name}
              </cite>
            </div>
          </div>
        </div>

        
        <div className="mt-10 lg:mt-16 text-center mx-4 lg:mx-0">
          <div className="max-w-4xl mx-auto bg-background p-6 lg:p-10 rounded-2xl border border-border shadow-lg">
            <h4 className="text-xl lg:text-3xl font-bold text-foreground mb-4 lg:mb-6">
              Join Our Mission
            </h4>
            <p className="text-base lg:text-xl text-muted-foreground leading-relaxed mb-6 lg:mb-8 px-2">
              {founderInfo.callToAction}
            </p>
            
            
            <div className="flex justify-center">
              <div className="w-24 lg:w-32 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;