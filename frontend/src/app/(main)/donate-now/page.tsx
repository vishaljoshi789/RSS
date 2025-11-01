import React from 'react';
import { HeroSection, ImpactSection, DetailedInfoSection, EmotionalAppealSection, DonationForm } from './_components';

const DonateNowPage = () => {
  return (
    <div className="min-h-screen bg-background lg:pt-2 mt-16">
      <div className="px-0">
        <HeroSection />
        <ImpactSection />
        <DetailedInfoSection />
        <EmotionalAppealSection />
        <DonationForm />
      </div>
    </div>
  );
};

export default DonateNowPage;
