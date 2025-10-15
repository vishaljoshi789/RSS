import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, Globe, TrendingUp } from 'lucide-react';

const impactItems = [
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "सामाजिक कल्याण",
    description: "रक्तदान शिविर, स्वास्थ्य सेवा और आपातकालीन सहायता में योगदान",
    stats: "50,000+ लाभार्थी"
  },
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: "शिक्षा और प्रशिक्षण",
    description: "युवा प्रशिक्षण कार्यक्रम और चरित्र निर्माण गतिविधियों में सहयोग",
    stats: "25,000+ छात्र"
  },
  {
    icon: <Globe className="w-8 h-8 text-green-500" />,
    title: "सांस्कृतिक संरक्षण",
    description: "भारतीय संस्कृति और परंपरा के संरक्षण में योगदान",
    stats: "1,000+ कार्यक्रम"
  },
  {
    icon: <Shield className="w-8 h-8 text-purple-500" />,
    title: "राष्ट्र सेवा",
    description: "राष्ट्रीय एकता और धार्मिक मूल्यों के संवर्धन में सहयोग",
    stats: "सभी राज्यों में सक्रिय"
  },
];

const ImpactSection = () => {
  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1">
            <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
            प्रभाव और परिणाम
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            आपका दान कैसे उपयोग होता है
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            हमारे संगठन द्वारा किए जाने वाले विभिन्न सेवा कार्यों में आपका योगदान प्रभावी रूप से उपयोग होता है।
            पारदर्शिता और जवाबदेही हमारे मुख्य सिद्धांत हैं।
          </p>
        </div>
        
        {/* Impact Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {impactItems.map((item, index) => (
            <Card 
              key={index} 
              className="text-center p-5 border rounded-xl"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-center mb-3">
                  <div className="p-2.5 bg-muted rounded-lg">
                    {item.icon}
                  </div>
                </div>
                <CardTitle className="text-base font-semibold text-foreground">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-2 border-t">
                  <Badge variant="secondary" className="text-xs font-medium bg-primary/10 text-primary">
                    {item.stats}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-muted/30 rounded-xl p-6 border">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
              आज ही योगदान करें और बदलाव का हिस्सा बनें
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl mx-auto">
              आपका हर योगदान हजारों लोगों के जीवन में सकारात्मक बदलाव लाता है
            </p>
            <div className="flex justify-center">
              <div className="flex items-center gap-2 text-sm text-primary">
                <Heart className="w-4 h-4" />
                <span className="font-medium">मिलकर करें समाज सेवा</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;