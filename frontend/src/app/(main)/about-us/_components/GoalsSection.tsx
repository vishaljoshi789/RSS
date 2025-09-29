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
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            {goals.title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            हमारे संगठन के मुख्य लक्ष्य और उद्देश्य जो समाज के कल्याण के लिए हैं
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {goals.objectives.map((objective, index) => (
            <Card key={index} className="p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-primary">
              <div className="space-y-2 sm:space-y-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{objective}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;