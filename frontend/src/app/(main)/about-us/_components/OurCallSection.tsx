import React from 'react';

interface OurCallSectionProps {
  ourCall: {
    title: string;
    intro: string;
    motto: string;
    mottoTranslation: string;
    commitment: string;
    whyWeExist: {
      title: string;
      points: string[];
    };
    against: string;
  };
}

const OurCallSection: React.FC<OurCallSectionProps> = ({ ourCall }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 lg:space-y-10">
          {/* Title and Introduction */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {ourCall.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              {ourCall.intro.split('*').map((part, idx) => 
                idx % 2 === 1 ? <strong key={idx} className="text-foreground font-bold">{part}</strong> : part
              )}
            </p>
          </div>

          {/* Motto Quote */}
          <div className="relative p-8 sm:p-10 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 text-center space-y-3">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                &quot;{ourCall.motto}&quot;
              </h3>
              <p className="text-lg sm:text-xl opacity-90 italic">
                ({ourCall.mottoTranslation})
              </p>
              <p className="text-base sm:text-lg leading-relaxed pt-4">
                {ourCall.commitment.split('*').map((part, idx) => 
                  idx % 2 === 1 ? <strong key={idx} className="font-bold underline">{part}</strong> : part
                )}
              </p>
            </div>
          </div>

          {/* Why We Exist */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center">
              {ourCall.whyWeExist.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {ourCall.whyWeExist.points.map((point, index) => (
                <div
                  key={index}
                  className="p-5 sm:p-6 border border-gray-200 bg-gradient-to-br from-background to-muted/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {point.split('*').map((part, idx) => 
                        idx % 2 === 1 ? <strong key={idx} className="text-foreground font-bold">{part}</strong> : part
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Against Section */}
          <div className="p-6 sm:p-8 border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/20 rounded-r-xl">
            <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium">
              {ourCall.against.split('*').map((part, idx) => 
                idx % 2 === 1 ? <strong key={idx} className="text-red-600 dark:text-red-400 font-bold">{part}</strong> : part
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurCallSection;