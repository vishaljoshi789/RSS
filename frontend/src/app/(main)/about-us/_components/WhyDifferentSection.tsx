import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WhyDifferentSectionProps {
  whyDifferent: {
    title: string;
    motto: string;
    content: string[];
  };
}

const WhyDifferentSection: React.FC<WhyDifferentSectionProps> = ({
  whyDifferent,
}) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30 relative">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border bg-gradient-to-br from-background via-background/95 to-background/90 overflow-hidden">
          <CardContent className="relative z-10 p-6 sm:p-10 lg:p-16">
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                हमारी विशेषता
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 leading-tight">
                {whyDifferent.title}
              </h2>

              <div className="flex justify-center">
                <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2.5 text-base font-bold rounded-lg">
                  {whyDifferent.motto}
                </Badge>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {whyDifferent.content.map((item, index) => (
                <Card
                  key={index}
                  className="group p-5 sm:p-6 border bg-gradient-to-br from-background to-muted/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-1 h-14 bg-gradient-to-b from-primary to-primary/50 rounded-full flex-shrink-0"></div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
                      {item}
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-muted/20 to-muted/10 p-6 max-w-5xl mx-auto">
                <Image
                  src="https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-05-at-3.03.54-PM-scaled.webp"
                  alt="Religious Community Gathering"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="mt-6 bg-gradient-to-r from-primary/10 to-secondary/10 p-5 rounded-xl border border-primary/20 max-w-3xl mx-auto">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
                  हमारे संगठन में सभी आयु वर्ग के लोग शामिल हैं। हम जाति, वर्ग
                  की सीमाओं से ऊपर उठकर एक साथ काम करते हैं।
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
