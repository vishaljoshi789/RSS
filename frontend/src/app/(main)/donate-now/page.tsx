import React from 'react';
import { HeroSection, ImpactSection, DetailedInfoSection, EmotionalAppealSection, DonationForm } from './_components';

const DonateNowPage = () => {
  return (
    <div className="min-h-screen bg-background pt-3">
      <div className="">
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
