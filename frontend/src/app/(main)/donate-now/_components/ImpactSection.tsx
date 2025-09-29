import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, Globe } from 'lucide-react';

const impactItems = [
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "सामाजिक कल्याण",
    description: "रक्तदान शिविर, स्वास्थ्य सेवा और आपातकालीन सहायता में योगदान"
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: "शिक्षा और प्रशिक्षण",
    description: "युवा प्रशिक्षण कार्यक्रम और चरित्र निर्माण गतिविधियों में सहयोग"
  },
  {
    icon: <Globe className="w-8 h-8 text-green-500" />,
    title: "सांस्कृतिक संरक्षण",
    description: "भारतीय संस्कृति और परंपरा के संरक्षण में योगदान"
  },
  {
    icon: <Shield className="w-8 h-8 text-purple-500" />,
    title: "राष्ट्र सेवा",
    description: "राष्ट्रीय एकता और धार्मिक मूल्यों के संवर्धन में सहयोग"
  },
];

const ImpactSection = () => {
  return (
    <section className="py-12 lg:py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            आपका दान कैसे उपयोग होता है
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            हमारे संगठन द्वारा किए जाने वाले विभिन्न सेवा कार्यों में आपका योगदान प्रभावी रूप से उपयोग होता है
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactItems.map((item, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;