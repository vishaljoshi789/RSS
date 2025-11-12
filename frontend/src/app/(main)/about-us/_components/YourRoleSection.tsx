import React from "react";
import { Heart } from "lucide-react";

interface YourRoleSectionProps {
  yourRole: {
    title: string;
    intro: string;
    emphasis: string;
    quotes: string[];
    action: string;
    finalQuote: string;
  };
}

const YourRoleSection: React.FC<YourRoleSectionProps> = ({ yourRole }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-white to-green-50 dark:from-orange-950/20 dark:via-background dark:to-green-950/20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8 lg:space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4 lg:mb-6">
              <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              <span className="text-sm lg:text-base text-primary font-semibold">
                आपका योगदान
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {yourRole.title}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {yourRole.intro.split("*").map((part, idx) =>
                idx % 2 === 1 ? (
                  <strong key={idx} className="text-foreground font-bold">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          </div>

          <div className="p-6 lg:p-8 bg-primary/5 border-l-4 border-primary rounded-r-xl max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-foreground font-bold italic">
              {yourRole.emphasis}
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {yourRole.quotes.map((quote, index) => (
              <div
                key={index}
                className="p-6 lg:p-8 bg-gradient-to-r from-primary/10 to-transparent rounded-xl border border-primary/20"
              >
                <p className="text-base sm:text-lg text-foreground font-semibold italic">
                  &quot;{quote}&quot;
                </p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {yourRole.action.split("*").map((part, idx) =>
                idx % 2 === 1 ? (
                  <strong key={idx} className="text-foreground font-bold">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          </div>

          <div className="p-6 sm:p-8 border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/20 rounded-r-xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <p className="text-lg sm:text-xl lg:text-2xl font-bold leading-relaxed">
                &quot;{yourRole.finalQuote}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YourRoleSection;
