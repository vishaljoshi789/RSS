import React from 'react';
import { Card } from '@/components/ui/card';

interface GoalsSectionProps {
  goals: {
    title: string;
    objectives: string[];
  };
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ goals }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            हमारा लक्ष्य: राष्ट्रधर्म की पूर्ति
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
            {goals.title}
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            राष्ट्रीय सेवा संघ की *सेवा और राष्ट्रवाद* की भावना को दर्शाते हुए, हमारे मुख्य उद्देश्य निम्नलिखित हैं। हम *&apos;संकल्पों से संगठित चेतना&apos;* के सिद्धांत पर चलते हुए एक *वैदिक, संगठित एवं सशक्त भारत* के निर्माण हेतु समर्पित हैं।
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {goals.objectives.map((objective, index) => (
            <Card key={index} className="group p-5 sm:p-6 border bg-gradient-to-br from-background to-muted/30">
              <div className="space-y-3 sm:space-y-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-xl flex items-center justify-center text-base font-bold">
                  {index + 1}
                </div>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">
                  {objective}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;