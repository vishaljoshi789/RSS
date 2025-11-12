import React from 'react';

interface GoalsSectionProps {
  goals: {
    title: string;
    categories: Array<{
      title: string;
      points: Array<{
        label: string;
        content: string;
      }>;
    }>;
  };
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ goals }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            हमारा लक्ष्य: राष्ट्रधर्म की पूर्ति
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
            {goals.title}
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            राष्ट्रीय सेवा संघ की सेवा और राष्ट्रवाद की भावना को दर्शाते हुए, हमारे मुख्य उद्देश्य निम्नलिखित हैं।
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {goals.categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="border-2 border-gray-200 bg-white dark:bg-background rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-200 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {categoryIndex + 1}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {category.title}
                  </h3>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="space-y-4">
                  {category.points.map((point, pointIndex) => (
                    <div
                      key={pointIndex}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        <strong className="text-foreground font-bold">{point.label}</strong>{' '}
                        {point.content.split('*').map((part, idx) => 
                          idx % 2 === 1 ? <strong key={idx} className="text-foreground font-bold">{part}</strong> : part
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoalsSection;