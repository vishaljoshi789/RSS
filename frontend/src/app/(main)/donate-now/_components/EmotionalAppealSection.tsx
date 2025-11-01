import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EmotionalAppealSection = () => {
  return (
    <section className="py-6 sm:py-12 mb-6 sm:mb-8 max-w-7xl mx-auto px-2 sm:px-0">
      {/* Quote & Purpose Combined */}
      <Card className="mb-4 sm:mb-6 border shadow-md">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <p className="text-sm sm:text-lg md:text-xl font-bold text-center text-orange-600 dark:text-orange-500 mb-4 sm:mb-6 leading-snug">
            "सेवा तब होती है जब हृदय रो पड़ता है, और आत्मा संकल्प लेती है।"
          </p>
          <p className="text-xs sm:text-sm md:text-base text-center text-muted-foreground mb-4 sm:mb-6">
            हमने देखा है... और इसी पीड़ा ने हमें <strong className="text-foreground">'राष्ट्रीय सेवा संघ भारतवर्ष'</strong> बना दिया।
          </p>
          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-3 sm:p-5 border border-orange-200 dark:border-orange-800">
            <p className="text-xs sm:text-sm md:text-base text-center font-semibold text-foreground">
              आपका दान — किसी की उम्मीद बन सकता है
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Final Message */}
      <Card className="border border-amber-300 dark:border-amber-800 shadow-md bg-amber-50 dark:bg-amber-950/30">
        <CardContent className="p-4 sm:p-6 text-center">
          <p className="text-sm sm:text-base md:text-lg font-bold text-foreground">
            एक रूपया भी यदि भाव से दिया जाए, तो वो करोड़ों का पुण्य बन जाता है।
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default EmotionalAppealSection;
