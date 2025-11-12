export interface MissionCard {
  id: number;
  title: string;
  description: string;
  image: string;
  alt: string;
  type: "ongoing" | "upcoming";
  author: {
    name: string;
    image: string;
  };
  postedDate: string;
}

export const divineMissionData: MissionCard[] = [
  {
    id: 1,
    title: "धार्मिक स्थलों एवं गौमाता की रक्षा",
    description: "मठ-मंदिरों की मर्यादा व पवित्रता की रक्षा तथा गौमाता के संरक्षण हेतु सेवा और जागरूकता कार्य।",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/Picsart_25-08-07_01-08-55-441.webp",
    alt: "धार्मिक स्थलों की रक्षा",
    type: "ongoing",
    author: {
      name: "राष्ट्रीय सेवा संघ",
      image: "/logo/rss-logo.png"
    },
    postedDate: "15 अक्टूबर 2024"
  },
  {
    id: 2,
    title: "रक्तदान अभियान – जीवन की आशा",
    description: "ग्रामीण व शहरी क्षेत्रों में स्वास्थ्य जांच, रक्तदान व आयुर्वेदिक चिकित्सा शिविर आयोजित करना।",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.26-PM-1-e1756385063931.webp",
    alt: "रक्तदान अभियान",
    type: "ongoing",
    author: {
      name: "राष्ट्रीय सेवा संघ",
      image: "/logo/rss-logo.png"
    },
    postedDate: "20 सितंबर 2024"
  },
  {
    id: 3,
    title: "असहाय बच्चों की शिक्षा",
    description: "गरीब, अनाथ बच्चों को शिक्षा, भोजन और आवास देकर उन्हें योग्य, संस्कारी और आत्मनिर्भर नागरिक बनाने की प्रेरणा।",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.26-PM-e1756385049326.webp",
    alt: "बच्चों की शिक्षा",
    type: "ongoing",
    author: {
      name: "राष्ट्रीय सेवा संघ",
      image: "/logo/rss-logo.png"
    },
    postedDate: "5 अगस्त 2024"
  },
  {
    id: 4,
    title: "महिला सशक्तिकरण",
    description: "नारी सम्मान, शिक्षा और आत्मनिर्भरता की ओर मजबूत कदम, जिससे हर बहन-बेटी स्वावलंबी और सुरक्षित बन सके।",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.25-PM-2-e1756385029423.webp",
    alt: "महिला सशक्तिकरण",
    type: "ongoing",
    author: {
      name: "राष्ट्रीय सेवा संघ",
      image: "/logo/rss-logo.png"
    },
    postedDate: "12 जुलाई 2024"
  },
  {
    id: 5,
    title: "व्यापारी हित संरक्षण",
    description: "स्थानीय व्यापारियों को सम्मान और सुरक्षा, अवैध हस्तक्षेप से मुक्ति और व्यवसाय के निरंतर विकास का संकल्प।",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.25-PM-1.webp",
    alt: "व्यापारी हित संरक्षण",
    type: "upcoming",
    author: {
      name: "राष्ट्रीय सेवा संघ",
      image: "/logo/rss-logo.png"
    },
    postedDate: "25 जून 2024"
  },
  {
    id: 6,
    title: "धार्मिक यात्राएं – आस्था का संगम",
    description: "सनातन धर्म की जड़ों से जुड़ने हेतु तीर्थ यात्राओं, कथा-सत्संग और संस्कारों से ओतप्रोत आयोजनों का संचालन।",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.25-PM-e1756385010760.webp",
    alt: "धार्मिक यात्राएं",
    type: "ongoing",
    author: {
      name: "राष्ट्रीय सेवा संघ",
      image: "/logo/rss-logo.png"
    },
    postedDate: "30 मई 2024"
  },
  {
    id: 7,
    title: "स्वच्छता अभियान",
    description: "समाज में स्वच्छता के प्रति जागरूकता, गंदगी से मुक्ति और स्वच्छ भारत के निर्माण हेतु निरंतर सामूहिक प्रयास।",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-06-at-1.21.24-PM-e1756384965824.webp",
    alt: "स्वच्छता अभियान",
    type: "upcoming",
    author: {
      name: "राष्ट्रीय सेवा संघ",
      image: "/logo/rss-logo.png"
    },
    postedDate: "18 अप्रैल 2024"
  }
];

export const missionSectionData = {
  title: "Our Divine Mission",
  subtitle: "Our Core Pillars of Work: Where Faith and Commitment Transform into Tangible National Service."
};