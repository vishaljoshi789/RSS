"use client";

import React from 'react';
import { aboutPageData } from './about';
import {
  HeroSection,
  PrimaryImageSection,
  IntroductionSection,
  WhoWeAreSection,
  WhyDifferentSection,
  WhyWeExistSection,
  TempleServiceSection,
  OurCallSection,
  // CommunityServiceSection,
  GoalsSection,
} from './_components';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-background pt-3">
      <HeroSection 
        mainTitle={aboutPageData.mainTitle} 
        subtitle="सव, समरपण और रषटर क परत हमर अटट परतबदधत क परचय" 
      />
      
      <PrimaryImageSection image={aboutPageData.primaryImage} />
      
      <IntroductionSection introduction={aboutPageData.introduction} />
      
      <WhoWeAreSection whoWeAre={aboutPageData.sections.whoWeAre} />
      
      <WhyDifferentSection whyDifferent={aboutPageData.sections.whyDifferent} />
      
      <WhyWeExistSection whyWeExist={aboutPageData.sections.whyWeExist} />
      
      <TempleServiceSection />
      
      <OurCallSection ourCall={aboutPageData.sections.ourCall} />
      
      {/* <CommunityServiceSection /> */}
      
      <GoalsSection goals={aboutPageData.sections.goals} />
      
    </div>
  );
};

export default AboutUsPage;
