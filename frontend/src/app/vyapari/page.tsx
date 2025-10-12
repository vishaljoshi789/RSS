import React from "react";
import VyapariHero from "./_components/hero";
import VyapariTrending from "./_components/trending";
import VyapariCategories from "./_components/categories";

const VyapariPortal = () => {
  return (
    <main className="w-full">
      <VyapariHero />
      <VyapariTrending />
      <VyapariCategories />
    </main>
  );
};

export default VyapariPortal;