import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  BookOpen,
  TrendingUp,
  Home,
  Wheat,
  Building2,
  Ambulance,
} from "lucide-react";

const impactItems = [
  {
    icon: <Shield className="w-8 h-8 text-red-500" />,
    title: "बहन बेटियों की सुरक्षा",
    description: "महिला सुरक्षा और सशक्तिकरण के लिए विशेष कार्यक्रम एवं संसाधन",
    stats: "हजारों परिवार सुरक्षित",
    color: "from-red-500/10 to-pink-500/10",
  },
  {
    icon: <BookOpen className="w-8 h-8 text-blue-500" />,
    title: "गुरुकुल और शिक्षा",
    description:
      "धार्मिक संस्कारों के साथ निःशुल्क शिक्षा, पुस्तकें, वस्त्र और भोजन सामग्री",
    stats: "25,000+ छात्र लाभान्वित",
    color: "from-blue-500/10 to-cyan-500/10",
  },
  {
    icon: <Wheat className="w-8 h-8 text-green-500" />,
    title: "गौशाला संरक्षण",
    description: "गौमाता की सुरक्षा एवं जीवन यापन हेतु चारा और अन्य सुविधाएं",
    stats: "1,000+ गौमाता संरक्षित",
    color: "from-green-500/10 to-emerald-500/10",
  },
  {
    icon: <Home className="w-8 h-8 text-purple-500" />,
    title: "मठ मंदिर संरक्षण",
    description:
      "सनातन धर्म के मठ मंदिरों का संरक्षण और धार्मिक स्थलों का विकास",
    stats: "100+ मंदिर संरक्षित",
    color: "from-purple-500/10 to-violet-500/10",
  },
  {
    icon: <Ambulance className="w-8 h-8 text-orange-500" />,
    title: "निःशुल्क स्वास्थ्य सेवा",
    description: "वंचितों के लिए एम्बुलेंस सेवा और मुफ्त चिकित्सा सहायता",
    stats: "50,000+ सेवाएं प्रदान",
    color: "from-orange-500/10 to-amber-500/10",
  },
  {
    icon: <Building2 className="w-8 h-8 text-indigo-500" />,
    title: "बुनियादी ढांचा विकास",
    description: "गुरुकुल निर्माण, स्थाई भवन और अन्य मूलभूत सुविधाओं का विकास",
    stats: "20+ प्रोजेक्ट पूर्ण",
    color: "from-indigo-500/10 to-blue-500/10",
  },
];

const ImpactSection = () => {
  return (
    <section className="mb-6 sm:mb-8 max-w-7xl mx-auto">
      <div className="text-center mb-4 sm:mb-6 px-2">
        <Badge variant="outline" className="mb-2 sm:mb-3 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm">
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-primary" />
          हमारा प्रभाव
        </Badge>
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent px-2">
          आपका दान कैसे उपयोग होता है
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {impactItems.map((item, index) => (
          <Card
            key={index}
            className="group overflow-hidden border hover:border-primary/50 transition-all hover:shadow-md"
          >
            <div className={`h-1 `}></div>
            <CardHeader className="pb-2 p-3 sm:p-6">
              <div className="flex items-start justify-between mb-2">
                <div className="p-1.5 sm:p-2 bg-muted rounded-lg flex items-center justify-center">
                  <div className="[&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-8 sm:[&_svg]:h-8">
                    {item.icon}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[10px] sm:text-xs bg-primary/10 text-primary px-1.5 sm:px-2 py-0.5"
                >
                  {item.stats}
                </Badge>
              </div>
              <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 sm:pb-4 px-3 sm:px-6">
              <p className="text-xs sm:text-sm text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default ImpactSection;
