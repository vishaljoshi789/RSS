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
    <section className="mb-8 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-3 px-4 py-1.5">
          <TrendingUp className="w-4 h-4 mr-2 text-primary" />
          हमारा प्रभाव
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
          आपका दान कैसे उपयोग होता है
        </h2>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {impactItems.map((item, index) => (
          <Card
            key={index}
            className="group overflow-hidden border hover:border-primary/50 transition-all hover:shadow-md"
          >
            <div className={`h-1 `}></div>
            <CardHeader className="pb-2 ">
              <div className="flex items-start justify-between mb-2">
                <div className="p-2 bg-muted rounded-lg">{item.icon}</div>
                <Badge
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary"
                >
                  {item.stats}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-foreground">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="text-sm text-muted-foreground">
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
