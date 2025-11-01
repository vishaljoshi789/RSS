import { LucideIcon, Home, Users, UserPlus, Heart, Newspaper, Target, Award, FileText, Users2, LogIn, UserCheck, IdCard, BookOpen, Camera, Edit3, PhoneCall } from 'lucide-react';

export interface NavItem {
  id: string;
  title: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  submenu?: NavItem[];
}

export const navigationItems: NavItem[] = [
  {
    id: "home",
    title: "Home",
    href: "/",
    icon: Home,
    description: "राष्ट्रीय सेवा संघ का मुख्य पृष्ठ"
  },
  {
    id: "about-us",
    title: "About Us",
    href: "/about-us",
    icon: Users,
    description: "हमारे बारे में जानकारी",
    submenu: [
      {
        id: "vision-mission",
        title: "Vision & Mission",
        href: "/#rss-overview",
        icon: Target,
        description: "हमारा दृष्टिकोण और मिशन",
      },
      {
        id: "founders-team",
        title: "Founders & Team Members",
        href: "/founders-team-members",
        icon: Users2,
        description: "संस्थापक और टीम सदस्य",
      },
      {
        id: "constitution",
        title: "Constitution & Principles",
        href: "#",
        icon: FileText,
        description: "संविधान और सिद्धांत",
      },
      {
        id: "our-work",
        title: "Our Works",
        href: "/#our-work",
        icon: Award,
        description: "हमारे कार्य और उपलब्धियां",
      }
    ],
  },
  {
    id: "join-us",
    title: "Join Us",
    href: "#",
    icon: UserPlus,
    description: "हमसे जुड़ें",
    submenu: [
      {
        id: "become-member",
        title: "Become a Member",
        href: "/become-member",
        icon: UserCheck,
        description: "सदस्यता के लिए पंजीकरण",
      },
      {
        id: "Vyapari-registration",
        title: "Vyapari Registration",
        href: "/vyapari",
        icon: Users,
        description: "स्वयंसेवक बनें",
      }
    ],
  },
  {
    id: "donate-support",
    title: "Support",
    href: "/donate-now",
    icon: Heart,
    description: "दान करें और हमारा समर्थन करें"
  },
  {
    id: "news-updates",
    title: "News & Updates",
    href: "#",
    icon: Newspaper,
    description: "समाचार और अपडेट्स",
    submenu: [
      {
        id: "press-release",
        title: "Press Release",
        href: "/#press-release",
        icon: BookOpen,
        description: "प्रेस विज्ञप्ति",
      },
      {
        id: "media-gallery",
        title: "Media Gallery",
        href: "/gallery",
        icon: Camera,
        description: "मीडिया गैलरी",
      },
      {
        id: "blog-articles",
        title: "Blog / Articles",
        href: "#",
        icon: Edit3,
        description: "ब्लॉग और लेख",
      },
    ],
  },{
    id: "contact",
    title: "Contact",
    href: "/contact-us",
    icon: PhoneCall,
    description: "हमसे संपर्क करें"
  },
];
