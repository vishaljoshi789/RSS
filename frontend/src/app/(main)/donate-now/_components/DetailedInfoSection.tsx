'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Home, 
  Shirt, 
  Wheat, 
  Building2, 
  Ambulance, 
  Shield,
  Sparkles,
  Phone,
  Building,
  CreditCard,
  Copy,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const requirements = [
  { icon: <Home className="w-5 h-5" />, text: "स्थाई स्वामित्व के लिए भूमि / भवन", color: "bg-blue-500" },
  { icon: <Book className="w-5 h-5" />, text: "निर्धन बच्चों की पुस्तक एवं लेखन आदि की सामग्री", color: "bg-purple-500" },
  { icon: <Shirt className="w-5 h-5" />, text: "विद्यार्थियों के लिए वस्त्र, भोजन सामग्री, खेलकूद सामग्री", color: "bg-green-500" },
  { icon: <Wheat className="w-5 h-5" />, text: "गौशालाओं में गौमाता की सुरक्षा एवं जीवन यापन हेतु चारा", color: "bg-yellow-500" },
  { icon: <Building2 className="w-5 h-5" />, text: "गुरुकुल निर्माण हेतु सामग्री एवं अन्य मूलभूत सुविधा", color: "bg-orange-500" },
  { icon: <Ambulance className="w-5 h-5" />, text: "वंचितों के लिए निःशुल्क संचालित सेवा हेतु एम्बुलेंस", color: "bg-red-500" },
  { icon: <Shield className="w-5 h-5" />, text: "बहन बेटियों की सुरक्षा हेतु संसाधन", color: "bg-pink-500" },
];

const DetailedInfoSection = () => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section className="py-12 mb-8 max-w-7xl mx-auto">
      {/* Sanskrit Quote */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
          ।। सर्वेषामप्युपायानां दानं श्रेष्ठतमं मतम् ।।
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground italic">
          "सभी उपायों में दान सर्वश्रेष्ठ माना गया है"
        </p>
      </div>

      {/* Main Introduction */}
      <Card className="mb-8 shadow-md">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                राष्ट्रीय सेवा संघ धर्मार्थ ट्रस्ट (रजि०)
              </h3>
              <Badge className="bg-primary/10 text-primary border-primary/20">
                सनातनी हिंदू रक्षा अभियान (भारत)
              </Badge>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>
              हमारे द्वारा <strong className="text-foreground">निःशुल्क रूप से</strong> सनातनी समाज में धार्मिक मूल्यों की रक्षा, बहन बेटियों की सुरक्षा, मठ मंदिरों का संरक्षण, शिक्षा स्वास्थ्य एवं रोजगार की स्थिति सुधार, धार्मिक संस्कारों को बचाने हेतु <strong className="text-foreground">(गुरुकुल)</strong> के साथ-साथ अन्य प्रकल्पों द्वारा भारतीय संस्कृति को पुनः गौरव प्रदान करने का यह भागीरथ प्रयास तभी सफल हो सकता है जब इसमें अधिक से अधिक सामान्य और विशिष्टजनों का सहयोग प्राप्त होगा।
            </p>
            <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
              <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground font-medium">
                हम सभी सुधीजनों से व्यक्तिगत अपील करते हैं कि इस अभियान को यथासंभव तन, मन और धन से सहयोग कर इस अनुपम प्रयास को पल्लवित और पुष्पित होने में भागीदार बनें।
              </p>
            </div>
          </div>

          <div className="mt-8 bg-orange-50 dark:bg-orange-950/30 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              <p className="text-base font-bold text-foreground">शास्त्रों का भी कथन है -</p>
            </div>
            <p className="text-base sm:text-lg text-orange-700 dark:text-orange-300 font-semibold text-center leading-relaxed py-4">
              देवतार्थं च यज्ञार्थं ब्राह्मणार्थं गवार्थकम्।<br />
              यद्दत्तं तत्पारलौक्यं संविद्दत्तं तदुच्यते ।।
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Requirements Section */}
      <Card className="mb-8 border shadow-md">
        <CardHeader className="border-b bg-muted/30 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              संगठन की आवश्यकताएँ
            </CardTitle>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            <strong className="text-primary">"सनातनी हिंदू रक्षा अभियान (भारत)"</strong> के संकल्पों की पूर्ति हेतु निम्न आवश्यकताएं हैं:
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {requirements.map((item, index) => (
              <div 
                key={index}
                className="group bg-muted/30 rounded-lg border hover:border-primary/50 transition-all duration-300 hover:shadow-md p-5"
              >
                <div className={`inline-flex p-3 ${item.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-base font-bold text-foreground mb-2">सभी दानदाताओं से आग्रह</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  व्यक्तिगत या सामूहिक रूप से अपनी रुचि के अनुसार वस्तु, उपयोगी सामग्री एवं धन संगठन कार्यालय में अथवा बैंक के माध्यम से दे सकते हैं।
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details - Modern Design */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Bank Details Card */}
        <Card className="shadow-md border">
          <CardHeader className="bg-muted/30 border-b p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Building className="w-5 h-5 text-white" />
                </div>
                बैंक विवरण
              </CardTitle>
              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">सुरक्षित</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[
              { label: "Account Name", value: "Rashtriya Seva Sangh", field: "account-name" },
              { label: "Account Number", value: "76032104282", field: "account-number" },
              { label: "IFSC Code", value: "SBIN0RRUTGB", field: "ifsc" },
              { label: "Bank Name", value: "Uttarakhand Gramin Bank", field: "bank-name" },
            ].map((item) => (
              <div key={item.field}>
                <p className="text-xs text-muted-foreground mb-1.5 font-medium">{item.label}</p>
                <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 border hover:border-primary/50 transition-colors">
                  <p className="text-base font-bold text-foreground font-mono">{item.value}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => copyToClipboard(item.value, item.field)}
                  >
                    {copiedField === item.field ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* UPI Payment Card */}
        <Card className="border shadow-md">
          <CardHeader className="bg-muted/30 border-b p-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                UPI भुगतान
              </CardTitle>
              <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">त्वरित</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-xs text-muted-foreground mb-3 font-medium">PhonePe / Google Pay</p>
              <div className="bg-purple-50 dark:bg-purple-950/30 p-5 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-500 rounded-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-black text-foreground font-mono">9690511008</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0"
                    onClick={() => copyToClipboard("9690511008", "upi")}
                  >
                    {copiedField === "upi" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-bold text-foreground">अन्य भुगतान विकल्प:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <CreditCard className="w-4 h-4" />, label: "चेक" },
                  { icon: <CreditCard className="w-4 h-4" />, label: "NEFT" },
                  { icon: <CreditCard className="w-4 h-4" />, label: "RTGS" },
                  { icon: <CreditCard className="w-4 h-4" />, label: "नगद/कैश" },
                ].map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-muted/50 rounded-lg p-3 border hover:border-purple-500/50 transition-colors">
                    <div className="text-purple-500">{option.icon}</div>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground pt-2 border-t">
                💡 कार्यालय में नगद/कैश जमा कराकर रसीद प्राप्त करें
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tax Benefits */}
      <Card className="border shadow-md">
        <CardContent className="p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                  आयकर छूट लाभ
                </h3>
                <Badge className="bg-green-500 text-white text-xs">80G & 12AA</Badge>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                आपके द्वारा दान/सहयोग की गई राशि{' '}
                <strong className="text-foreground">आयकर अधिनियम की धारा 80G एवं 12AA</strong> के अंतर्गत{' '}
                <strong className="text-green-600 dark:text-green-400 text-lg">आयकर से पूर्णतः मुक्त</strong> होगी।
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      100% कर मुक्त
                    </Badge>
                    <Badge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      पंजीकृत ट्रस्ट
                    </Badge>
                    <Badge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/5">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      रसीद प्रदान की जाएगी
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
    </section>
  );
};

export default DetailedInfoSection;