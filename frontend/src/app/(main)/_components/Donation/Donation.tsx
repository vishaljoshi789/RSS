"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { donationData } from "./DonationInfo";
import {
  Heart,
  QrCode,
  CreditCard,
  Copy,
  Check,
  Banknote,
  Building2,
  CheckCircle,
  Gift,
  Users,
  Video,
  Calendar,
  Sparkles,
} from "lucide-react";

const benefits = [
  { icon: CheckCircle, text: "आभार प्रमाणपत्र" },
  { icon: Users, text: "संघ की सदस्यता" },
  { icon: Video, text: "सेवा कार्यों की रिपोर्ट" },
  { icon: Calendar, text: "आयोजनों में विशेष आमंत्रण" },
  { icon: Sparkles, text: "संतों का आशीर्वाद" },
];

const Donation = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Heart className="w-4 h-4 mr-2" />
            दान सेवा
          </Badge>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {donationData.title}
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {donationData.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          <Card className="group overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <QrCode className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl md:text-2xl font-bold text-foreground">
                  QR Code से दान करें
                </CardTitle>
              </div>
              <CardDescription className="text-base text-muted-foreground">
                {donationData.qrCode.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg bg-white p-4">
                <Image
                  src={donationData.qrCode.image}
                  alt={donationData.qrCode.alt}
                  fill
                  className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl p-4">
                <p className="text-sm md:text-base text-muted-foreground font-medium">
                  📱 अपने फोन का कैमरा या UPI ऐप से स्कैन करें
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 bg-card/80 backdrop-blur-sm border-2 border-primary/10 hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Building2 className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl md:text-2xl font-bold text-foreground text-center">
                  बैंक विवरण
                </CardTitle>
              </div>
              <CardDescription className="text-base text-muted-foreground text-center">
                सीधे बैंक खाते में स्थानांतरण करें
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        खाता धारक
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {donationData.bankDetails.accountName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        बैंक नाम
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {donationData.bankDetails.bankName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        खाता संख्या
                      </p>
                      <p className="text-base font-semibold text-foreground font-mono">
                        {donationData.bankDetails.accountNumber}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        donationData.bankDetails.accountNumber,
                        "account"
                      )
                    }
                    className="p-2 hover:bg-muted rounded-md transition-colors"
                    title="कॉपी करें"
                  >
                    {copiedField === "account" ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        IFSC कोड
                      </p>
                      <p className="text-base font-semibold text-foreground font-mono">
                        {donationData.bankDetails.ifscCode}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(donationData.bankDetails.ifscCode, "ifsc")
                    }
                    className="p-2 hover:bg-muted rounded-md transition-colors"
                    title="कॉपी करें"
                  >
                    {copiedField === "ifsc" ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 max-w-5xl mx-auto">
          <Card className="shadow-lg border-2 border-primary/10">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                📜 दानकर्ता के लिए क्या?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {benefits.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all"
                    >
                      <IconComponent className="w-6 h-6 text-primary" />
                      <span className="text-xs md:text-sm font-medium text-foreground text-center">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why We Ask Section */}
        <div className="mt-8 max-w-5xl mx-auto">
          <Card className="shadow-lg border-2 border-primary/10">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">
                💬 हम क्यों माँगते हैं आपका साथ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                क्योंकि हम जानते हैं — आप केवल दर्शक नहीं, बल्कि{" "}
                <strong className="text-foreground">धर्म और देश के रक्षक</strong> भी हैं।
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                आपका एक छोटा सहयोग हमारे लिए एक नई आशा, और किसी पीड़ित के लिए{" "}
                <strong className="text-foreground">संपूर्ण जीवन</strong> बन सकता है।
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-8 max-w-5xl mx-auto">
          <Card className="shadow-xl border-2 border-orange-300 dark:border-orange-700 bg-gradient-to-br from-orange-50 via-orange-100/50 to-orange-50 dark:from-orange-950/30 dark:via-orange-900/20 dark:to-orange-950/30">
            <CardContent className="p-8 md:p-10 text-center space-y-6">
              <p className="text-xl md:text-2xl font-bold text-foreground">
                🙏 तो आज… कुछ मत सोचिए। केवल हृदय से दीजिए।
              </p>
              <div className="bg-white dark:bg-background rounded-xl p-6 border-2 border-orange-200 dark:border-orange-800">
                <p className="text-base md:text-lg text-orange-700 dark:text-orange-300 font-semibold italic leading-relaxed">
                  "जो दिया वह बचेगा, जो रोका वह मिट जाएगा।<br />
                  धर्म में लगाया गया धन ही पुण्य बनकर पीढ़ियों को रक्षा देता है।"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Final Call to Action */}
        <div className="mt-8 max-w-5xl mx-auto">
          <Card className="shadow-2xl border-2 border-amber-400 dark:border-amber-700 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <Badge className="bg-primary text-white px-6 py-2 text-base mb-4">
                अंतिम आह्वान
              </Badge>
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-bold text-foreground">
                  आपका दान — सनातन धर्म की ढाल है।
                </p>
                <p className="text-xl md:text-2xl font-bold text-foreground">
                  आपका सहयोग — भारत के पुनर्जागरण की शुरुआत है।
                </p>
              </div>
              <div className="pt-6 border-t-2 border-amber-300 dark:border-amber-800">
                <p className="text-xl md:text-2xl font-black text-primary mb-6">
                  📣 अब आप उठें — और सेवा की इस अमृत यात्रा में सहभागी बनें।
                </p>
              </div>
              <div className="bg-white dark:bg-background rounded-xl p-6 border-2 border-amber-200 dark:border-amber-800">
                <p className="text-base md:text-lg text-muted-foreground italic mb-3">
                  यह केवल संगठन नहीं, यह आपकी आत्मा का उत्तर है।
                </p>
                <p className="text-lg md:text-xl font-bold text-foreground">
                  यह केवल दान नहीं, यह धर्मयुद्ध में आपकी उपस्थिति है!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Donation;
