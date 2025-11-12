import React from "react";

interface WhyDifferentSectionProps {
  whyDifferent: {
    title: string;
    intro: string;
    points: Array<{
      label: string;
      content: string;
    }>;
    quote: string;
  };
}

const WhyDifferentSection: React.FC<WhyDifferentSectionProps> = ({
  whyDifferent,
}) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-orange-950/20 dark:via-background dark:to-green-950/20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 lg:space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              हमारी विशेषता
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-5 leading-tight">
              {whyDifferent.title}
            </h2>
          </div>

          {/* Introduction Text */}
          <div className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium mb-6 text-center">
            {whyDifferent.intro.split('*').map((part, idx) => 
              idx % 2 === 1 ? <strong key={idx} className="text-foreground font-bold">{part}</strong> : part
            )}
          </div>

          {/* Key Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {whyDifferent.points.map((point, index) => (
              <div
                key={index}
                className="group p-5 sm:p-6 border border-gray-200 bg-gradient-to-br from-background to-muted/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-1 h-14 bg-gradient-to-b from-primary to-primary/50 rounded-full flex-shrink-0"></div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    <strong className="text-foreground font-bold">{point.label}</strong>
                    {point.content.split('*').map((part, idx) => 
                      idx % 2 === 1 ? <strong key={idx} className="text-foreground font-bold">{part}</strong> : part
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-8 p-6 sm:p-8 border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent rounded-r-xl">
            <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium italic">
              &quot;{whyDifferent.quote}&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
