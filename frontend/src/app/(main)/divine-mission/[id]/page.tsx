"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { divineMissionData } from "../../_components/DivineMission/MissionInfo";
import {
  Heart,
  Users,
  ArrowLeft,
  CheckCircle,
  Calendar,
  Clock,
  TrendingUp,
  Share2,
  BookmarkPlus,
  Eye,
  X,
  Images,
} from "lucide-react";
import { IMAGE_BLUR_DATA_URL } from "@/lib/image-placeholder";

const getGalleryImages = () => [
  {
    id: 1,
    url: "https://joinrss.org.in/wp-content/uploads/2025/08/Picsart_25-08-07_01-08-55-441.webp",
    alt: "मिशन गतिविधि 1",
  },
  {
    id: 2,
    url: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.26-PM-1-e1756385063931.webp",
    alt: "मिशन गतिविधि 2",
  },
  {
    id: 3,
    url: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.26-PM-e1756385049326.webp",
    alt: "मिशन गतिविधि 3",
  },
  {
    id: 4,
    url: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.25-PM-2-e1756385029423.webp",
    alt: "मिशन गतिविधि 4",
  },
];

const getMissionOutcomes = () => ({
  beneficiaries: "1000+",
  programs: "25+",
  volunteers: "150+",
  impact: "उच्च सामाजिक प्रभाव",
});

const MissionDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const missionId = parseInt(params.id as string);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "मिशन विवरण",
          text: "इस मिशन के बारे में जानें और इसमें शामिल हों!",
          url: window.location.href,
        })
        .then(() => "साझा किया गया")
        .catch((error) => console.log("साझा करने में त्रुटि:", error));
    } else {
      alert("शेयरिंग आपके ब्राउज़र द्वारा समर्थित नहीं है।");
    }
  };

  const mission = divineMissionData.find((m) => m.id === missionId);

  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">मिशन नहीं मिला</h1>
          <Button onClick={() => router.push("/divine-mission")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            सभी मिशन देखें
          </Button>
        </div>
      </div>
    );
  }

  const galleryImages = getGalleryImages();
  const outcomes = getMissionOutcomes();
  const relatedMissions = divineMissionData
    .filter((m) => m.id !== mission.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 mt-4 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div className="flex flex-col justify-center">
              <Badge
                className={`${
                  mission.type === "ongoing"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white mb-4 w-fit`}
              >
                {mission.type === "ongoing" ? (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    चल रहा है
                  </>
                ) : (
                  <>
                    <Calendar className="w-3 h-3 mr-1" />
                    आगामी
                  </>
                )}
              </Badge>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {mission.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={mission.author.image}
                      alt={mission.author.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {mission.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-900">
                    {mission.author.name}
                  </span>
                </div>

                <span className="text-gray-300">•</span>

                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{mission.postedDate}</span>
                </div>

                <span className="text-gray-300">•</span>

                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>2,547 बार देखा गया</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 hover:bg-gray-50"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  शेयर करें
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 hover:bg-gray-50"
                  onClick={() => (window.location.href = "/donate-now")}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  सहेजें
                </Button>
              </div>
            </div>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <Image
                src={mission.image}
                alt={mission.alt}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                priority
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            मिशन के बारे में
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              {mission.description}
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              यह मिशन राष्ट्रीय सेवा संघ के प्रमुख सेवा कार्यक्रमों में से एक
              है। हमारा उद्देश्य समाज के इस महत्वपूर्ण क्षेत्र में सकारात्मक
              परिवर्तन लाना और जरूरतमंदों की मदद करना है।
            </p>
            <p className="text-gray-600 leading-relaxed">
              इस मिशन के माध्यम से हम समाज के विभिन्न वर्गों तक पहुंचते हैं और
              उनके जीवन में सकारात्मक बदलाव लाने का प्रयास करते हैं। संघ के
              समर्पित स्वयंसेवक इस मिशन को सफल बनाने में अपना योगदान देते हैं।
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 md:p-8 shadow-sm border border-orange-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            अब तक का प्रभाव
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {outcomes.beneficiaries}
              </div>
              <div className="text-sm text-gray-600">लाभार्थी</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {outcomes.programs}
              </div>
              <div className="text-sm text-gray-600">कार्यक्रम</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {outcomes.volunteers}
              </div>
              <div className="text-sm text-gray-600">स्वयंसेवक</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary mb-1">⭐</div>
              <div className="text-sm text-gray-600">{outcomes.impact}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-primary" />
            प्रमुख उद्देश्य
          </h2>
          <div className="space-y-3">
            {[
              "समाज में सकारात्मक परिवर्तन लाना",
              "जरूरतमंदों को सहायता प्रदान करना",
              "सनातन धर्म और संस्कृति का संरक्षण",
              "राष्ट्रीय एकता को मजबूत करना",
              "समाज सेवा के प्रति जागरूकता बढ़ाना",
            ].map((objective, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{objective}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Images className="w-6 h-6 text-primary" />
            गैलरी
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <div
                key={img.id}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 md:p-8 shadow-sm border border-primary/20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            इस मिशन में शामिल हों
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            आपका योगदान समाज में सकारात्मक बदलाव ला सकता है। हमारे साथ जुड़ें और
            सेवा का हिस्सा बनें।
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => (window.location.href = "/donate-now")}
            >
              <Heart className="w-5 h-5" />
              दान करें
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => (window.location.href = "/auth/login")}
            >
              <Users className="w-5 h-5" />
              सदस्य बनें
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">अन्य मिशन</h2>
          {relatedMissions.length === 0 ? (
            <div className="text-sm text-gray-500">
              कोई संबंधित मिशन उपलब्ध नहीं है।
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedMissions.map((relatedMission) => (
                <Link
                  key={relatedMission.id}
                  href={`/divine-mission/${relatedMission.id}`}
                  aria-label={`${relatedMission.title} देखें`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                >
                  <div
                    role="article"
                    className="overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full bg-white"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={relatedMission.image}
                        alt={relatedMission.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        placeholder="blur"
                        blurDataURL={IMAGE_BLUR_DATA_URL}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-100" />
                      <Badge
                        className={`${
                          relatedMission.type === "ongoing"
                            ? "bg-green-500"
                            : "bg-blue-500"
                        } text-white absolute left-3 top-3 shadow-md`}
                      >
                        {relatedMission.type === "ongoing"
                          ? "चल रहा है"
                          : "आगामी"}
                      </Badge>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="text-white font-semibold text-base leading-snug line-clamp-2 drop-shadow-sm">
                          {relatedMission.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-[11px] sm:text-xs text-white/90">
                          <Avatar className="w-5 h-5">
                            <AvatarImage
                              src={relatedMission.author.image}
                              alt={relatedMission.author.name}
                            />
                            <AvatarFallback className="bg-white/20 text-white text-[10px]">
                              {relatedMission.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {relatedMission.author.name}
                          </span>
                          <span className="opacity-70">•</span>
                          <span>{relatedMission.postedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
            <Image
              src={galleryImages[selectedImage].url}
              alt={galleryImages[selectedImage].alt}
              fill
              className="object-contain"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionDetailPage;
