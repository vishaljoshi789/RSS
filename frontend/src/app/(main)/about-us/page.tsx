"use client";

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aboutPageData } from './about';
import Link from 'next/link';
import NormalButton from '@/components/common/RssButton/RssButton';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      
      
      <section className="py-12 sm:py-16 lg:py-28 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6 sm:mb-8">
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 inline-flex items-center">
              राष्ट्रीय सेवा संघ भारतवर्ष
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8 leading-tight px-2">
            {aboutPageData.mainTitle}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 max-w-4xl mx-auto leading-relaxed px-4">
            सेवा, समर्पण और राष्ट्र के प्रति हमारी अटूट प्रतिबद्धता का परिचय
          </p>
        </div>
      </section>

      
      <section className="py-8 sm:py-12 lg:py-16 mt-8 sm:-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden shadow-xl">
            <Image
              src={aboutPageData.primaryImage.url}
              alt={aboutPageData.primaryImage.alt}
              width={2048}
              height={1279}
              className="w-full h-[300px] sm:h-[400px] lg:h-[600px] object-cover"
              priority
            />
          </Card>
        </div>
      </section>

      
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-6 sm:p-8 lg:p-16">
              <div className="text-center mb-8 sm:mb-12">
                <blockquote className="text-lg sm:text-xl lg:text-3xl font-bold text-foreground mb-6 sm:mb-8 leading-relaxed px-2">
                  &ldquo;{aboutPageData.introduction.mainQuote}&rdquo;
                </blockquote>
                <div className="justify-center hidden md:flex items-center mt-4 sm:mt-6 px-4">
                  <Badge 
                    variant="secondary" 
                    className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-xs sm:text-sm lg:text-base font-semibold flex items-center justify-center bg-primary/10 text-primary border-primary/20 rounded-lg shadow-sm max-w-full break-words text-center leading-tight"
                  >
                    <span className="block sm:inline">स्थापना:</span>
                    <span className="block sm:inline sm:ml-1">{aboutPageData.introduction.foundingDate}</span>
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-6 text-center lg:text-justify">
                <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                  <strong className="text-primary font-bold">राष्ट्रीय सेवा संघ भारतवर्ष</strong> {aboutPageData.introduction.description}
                </p>
                <div className="bg-primary/5 border-l-4 border-primary p-4 sm:p-6 rounded-r-lg">
                  <p className="text-primary font-semibold text-base sm:text-lg leading-relaxed">
                    राष्ट्रीय सेवा संघ का प्रत्येक धर्म रक्षक, वेद और उपनिषदों में निहित सनातन सत्य को आत्मसात कर, भारतवर्ष की एकता, अखंडता और सांस्कृतिक गरिमा की रक्षा हेतु पूर्ण समर्पण भाव से सेवा कार्य में संलग्न है।
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      
      <section className="py-8 sm:py-12 lg:py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                  {aboutPageData.sections.whoWeAre.title}
                </h2>
              </div>
              <div className="space-y-4 sm:space-y-6">
                {aboutPageData.sections.whoWeAre.content.map((item, index) => (
                  <Card key={index} className="p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item}</p>
                  </Card>
                ))}
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="overflow-hidden">
                <Image
                  src="https://joinrss.org.in/wp-content/uploads/2025/06/Picsart_25-01-11_02-12-39-485.webp"
                  alt="RSS Banner"
                  width={1600}
                  height={533}
                  className="w-full h-[200px] sm:h-[250px] lg:h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl bg-gradient-to-br from-card to-muted/30">
            <CardContent className="p-6 sm:p-8 lg:p-16">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6 sm:mb-8">
                  {aboutPageData.sections.whyDifferent.title}
                </h2>
                <div className="flex justify-center">
                  <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-3 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-bold inline-flex items-center whitespace-nowrap">
                    {aboutPageData.sections.whyDifferent.motto}
                  </Badge>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {aboutPageData.sections.whyDifferent.content.map((item, index) => (
                  <Card key={index} className="p-4 sm:p-6 hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item}</p>
                  </Card>
                ))}
              </div>
              
              
              <div className="mt-8 text-center">
                <div className="overflow-hidden max-w-4xl mx-auto">
                  <Image
                    src="https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-05-at-3.03.54-PM-scaled.webp"
                    alt="Religious Community Gathering"
                    width={1200}
                    height={800}
                    className="w-full h-[250px] sm:h-[350px] lg:h-[500px] object-contain"
                  />
                </div>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                  हमारे संगठन में सभी आयु वर्ग के लोग शामिल हैं। हम जाति, वर्ग की सीमाओं से ऊपर उठकर एक साथ काम करते हैं।
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      
      <section className="py-8 sm:py-12 lg:py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              {aboutPageData.sections.whyWeExist.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto px-4">
              हमारे अस्तित्व का उद्देश्य और समाज के कल्याण के लिए हमारा दृष्टिकोण
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {aboutPageData.sections.whyWeExist.content.map((item, index) => (
              <Card key={index} className="p-4 sm:p-6 shadow-sm hover:shadow-lg transition-shadow">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{item}</p>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-xl">
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">हमारा संघर्ष</h3>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-base sm:text-lg">
                    हम उस अंधकार के विरुद्ध हैं जो हमारे धर्म को क्षीण कर रहा है।
                  </p>
                  <p className="text-base sm:text-lg">
                    हम उस अन्याय के विरुद्ध हैं जो हमारी बहनों, माताओं और मंदिरों पर हो रहा है।
                  </p>
                  <p className="text-base sm:text-lg">
                    हम उस विस्मृति के विरुद्ध हैं जो हमें हमारी संस्कृति, वेद, उपनिषद और गुरुकुलों से दूर ले जा रही है।
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Card className="overflow-hidden shadow-xl">
                <Image
                  src="https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.25-PM-e1756385010760.webp"
                  alt="Temple Visit - Devotees at Temple"
                  width={800}
                  height={600}
                  className="w-full h-[250px] sm:h-[350px] lg:h-[500px] object-cover"
                />
              </Card>
            </div>
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                धार्मिक आस्था और मंदिर सेवा
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  हमारे संगठन के सदस्य नियमित रूप से मंदिरों में जाकर प्रार्थना और सेवा करते हैं। यह हमारी आध्यात्मिक शक्ति का स्रोत है।
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  मंदिर केवल पूजा स्थल नहीं, बल्कि हमारी संस्कृति और परंपरा के संरक्षण का केंद्र हैं। हम मंदिरों की सुरक्षा और संरक्षण के लिए प्रतिबद्ध हैं।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-foreground">
              {aboutPageData.sections.ourCall.title}
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-muted-foreground">आज समय है —</p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {aboutPageData.sections.ourCall.points.map((point, index) => (
              <Card key={index} className="p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">{point}</p>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-xl">
            <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">न दैन्यं न पलायनम्</h3>
              <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
                {aboutPageData.sections.ourCall.conclusion}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      
      <section className="py-8 sm:py-12 lg:py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                समाज सेवा और रक्तदान
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  हमारा संगठन नियमित रूप से रक्तदान शिविर आयोजित करता है। यह हमारी सेवा भावना का प्रत्यक्ष प्रमाण है।
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  रक्तदान जीवनदान है - यह सिद्धांत हमारे हर सदस्य के हृदय में बसा है। हम समाज की सेवा के लिए हमेशा तत्पर रहते हैं।
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  आपातकाल में, प्राकृतिक आपदाओं में, या किसी भी समय जब समाज को हमारी आवश्यकता होती है, हम तत्काल सेवा के लिए उपस्थित होते हैं।
                </p>
              </div>
            </div>
            <div>
              <Card className="overflow-hidden shadow-xl">
                <Image
                  src="https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-01-at-10.08.01-PM-scaled.jpeg"
                  alt="Blood Donation Camp - Community Service"
                  width={1200}
                  height={800}
                  className="w-full h-[250px] sm:h-[350px] lg:h-[500px] object-cover"
                />
              </Card>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              {aboutPageData.sections.goals.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
              हमारे संगठन के मुख्य लक्ष्य और उद्देश्य जो समाज के कल्याण के लिए हैं
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {aboutPageData.sections.goals.objectives.map((objective, index) => (
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

      
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
            <CardContent className="p-6 sm:p-8 lg:p-16 text-center">
              <div className="max-w-4xl mx-auto">
                <div className="mb-4 sm:mb-8">
                  <div className="text-4xl sm:text-6xl lg:text-8xl font-bold text-primary-foreground/20 mb-2 sm:mb-4">&ldquo;</div>
                </div>
                <h2 className="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
                  {aboutPageData.finalMessage}
                </h2>
                <div className="mb-4 sm:mb-8">
                  <div className="text-4xl sm:text-6xl lg:text-8xl font-bold text-primary-foreground/20 rotate-180">&rdquo;</div>
                </div>
                <div className="border-t border-primary-foreground/20 pt-4 sm:pt-6 lg:pt-8">
                  <p className="text-sm sm:text-base lg:text-xl text-primary-foreground/90 leading-relaxed mb-4 sm:mb-6 lg:mb-8">
                    हमारे साथ जुड़कर भारत के उज्ज्वल भविष्य का निर्माण करें। सेवा, समर्पण और संकल्प के साथ।
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                    <Link href="/contact">
                      <NormalButton 
                        variant="secondary" 
                        size="lg" 
                        className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
                      >
                        संपर्क करें
                      </NormalButton>
                    </Link>
                    <Link href="/#donation">
                      <NormalButton 
                        variant="outline" 
                        size="lg" 
                        className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
                      >
                        दान करें
                      </NormalButton>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;