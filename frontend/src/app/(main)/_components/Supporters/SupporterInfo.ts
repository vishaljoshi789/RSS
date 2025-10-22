export interface SupporterInfo {
  id: number;
  name: string;
  imageUrl: string;
  alt: string;
}

export interface PageContent {
  mainTitle: string;
  mainSubtitle: string;
  introSection: {
    title: string;
    description: string;
    joinButtonText: string;
    learnMoreButtonText: string;
  };
  organizationName: string;
}


export interface VideoInfo {
  title: string;
  duration: string;
  description: string;
  videoSrc: string;
  posterSrc: string;
  fullScreenButtonText: string;
}


export const videoInfo: VideoInfo = {
  title: "संगठन परिचय वीडियो",
  duration: "अवधि: 2 मिनट 50 सेकंड",
  description: "हमारी यात्रा और दृष्टिकोण",
  videoSrc: "https://joinrss.org.in/wp-content/uploads/2025/09/InShot_20250915_180027869.mp4",
  posterSrc: "/hero/hero-01.png",
  fullScreenButtonText: "पूर्ण स्क्रीन में देखें"
};


export const supporterImages: SupporterInfo[] = [
  {
    id: 1,
    name: "Supporter 1",
    imageUrl: "https://joinrss.org.in/wp-content/uploads/2025/06/images-2.png",
    alt: "RSS Supporter"
  },
  {
    id: 2,
    name: "Supporter 2", 
    imageUrl: "https://joinrss.org.in/wp-content/uploads/2025/06/Picsart_25-06-21_23-35-59-409-1-scaled.jpg",
    alt: "RSS Supporter"
  },
  {
    id: 3,
    name: "Supporter 3",
    imageUrl: "https://joinrss.org.in/wp-content/uploads/2025/06/images.png", 
    alt: "RSS Supporter"
  },
  {
    id: 4,
    name: "Supporter 4",
    imageUrl: "https://joinrss.org.in/wp-content/uploads/2025/06/images-1.png",
    alt: "RSS Supporter"
  },
  {
    id: 5,
    name: "Supporter 5",
    imageUrl: "https://joinrss.org.in/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-26-at-6.20.21-PM-scaled.jpeg",
    alt: "RSS Supporter"
  },
  {
    id: 6,
    name: "Supporter 6",
    imageUrl: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-09-at-7.54.30-PM-1-scaled.jpeg",
    alt: "RSS Supporter"
  },
  {
    id: 7,
    name: "Supporter 7", 
    imageUrl: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-09-at-7.54.30-PM-scaled.jpeg",
    alt: "RSS Supporter"
  }
];

export const pageContent: PageContent = {
  mainTitle: "राष्ट्रीय सेवा संघ का परिचय",
  mainSubtitle: "सेवा, समर्पण और राष्ट्र के प्रति हमारी अटूट प्रतिबद्धता को समझें",
  introSection: {
    title: "राष्ट्रीय सेवा संघ का संपूर्ण परिचय",
    description: "हमारे संगठन के उद्देश्य, कार्यप्रणाली और भविष्य की योजनाओं के बारे में विस्तार से जानें। देखें कि कैसे हम सभी मिलकर एक मजबूत और समृद्ध भारत का निर्माण कर सकते हैं।",
    joinButtonText: "Join Our Mission",
    learnMoreButtonText: "Learn More"
  },
  organizationName: "राष्ट्रीय सेवा संघ"
};



export const supporterRows = {
  row1: supporterImages.slice(0, Math.ceil(supporterImages.length / 3)),
  row2: supporterImages.slice(Math.ceil(supporterImages.length / 3), Math.ceil(supporterImages.length * 2 / 3)),
  row3: supporterImages.slice(Math.ceil(supporterImages.length * 2 / 3))
};
