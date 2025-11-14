export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: {
    name: string;
    image: string;
    role: string;
  };
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
}

export const blogCategories = [
  "All",
  "News",
  "Events",
  "Social Work",
  "Updates",
  "Announcements",
] as const;

// Sample blog data
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "राष्ट्रीय सेवा संघ का वार्षिक महासम्मेलन 2025",
    slug: "annual-conference-2025",
    excerpt:
      "राष्ट्रीय सेवा संघ का वार्षिक महासम्मेलन 15-17 मार्च 2025 को नई दिल्ली में आयोजित होगा। इस महासम्मेलन में देशभर से हजारों सेवा कार्यकर्ता भाग लेंगे।",
    content: `
      <p>राष्ट्रीय सेवा संघ अपने वार्षिक महासम्मेलन की घोषणा करते हुए गर्व महसूस कर रहा है। यह महासम्मेलन 15-17 मार्च 2025 को राजधानी नई दिल्ली में आयोजित होगा।</p>
      
      <h2>मुख्य आकर्षण</h2>
      <ul>
        <li>राष्ट्रीय नेताओं के प्रेरक भाषण</li>
        <li>समाज सेवा कार्यशालाएं</li>
        <li>संस्कृति कार्यक्रम</li>
        <li>युवा सम्मेलन</li>
      </ul>
      
      <p>इस वर्ष के महासम्मेलन की थीम है "भारत का भविष्य - युवा शक्ति"। देशभर से 5000+ सेवा कार्यकर्ता इस कार्यक्रम में भाग लेंगे।</p>
    `,
    image:
      "/live/img-10.jpg",
    category: "Events",
    author: {
      name: "राजेश कुमार",
      image: "/placeholder-avatar.jpg",
      role: "राष्ट्रीय संयोजक",
    },
    date: "2025-01-15",
    readTime: "5 min",
    tags: ["Conference", "Annual Event", "Delhi", "Youth"],
    featured: true,
  },
  {
    id: 2,
    title: "ग्रामीण क्षेत्रों में शिक्षा सेवा का विस्तार",
    slug: "rural-education-expansion",
    excerpt:
      "राष्ट्रीय सेवा संघ ने 100+ गांवों में नई शिक्षा केंद्र खोलने की घोषणा की है। यह पहल ग्रामीण बच्चों को गुणवत्तापूर्ण शिक्षा प्रदान करने के लिए है।",
    content: `
      <p>राष्ट्रीय सेवा संघ ग्रामीण भारत में शिक्षा की पहुंच बढ़ाने के लिए एक बड़ी पहल कर रहा है।</p>
      
      <h2>परियोजना का विवरण</h2>
      <p>इस योजना के तहत 100 से अधिक गांवों में शिक्षा केंद्र स्थापित किए जाएंगे।</p>
    `,
    image:
      "/live/img-11.jpg",
    category: "Social Work",
    author: {
      name: "प्रिया शर्मा",
      image: "/placeholder-avatar.jpg",
      role: "शिक्षा संयोजक",
    },
    date: "2025-01-10",
    readTime: "7 min",
    tags: ["Education", "Rural Development", "Social Service"],
    featured: true,
  },
  {
    id: 3,
    title: "स्वच्छता अभियान का सफल समापन",
    slug: "cleanliness-drive-success",
    excerpt:
      "पिछले महीने आयोजित स्वच्छता अभियान में 10,000+ स्वयंसेवकों ने भाग लिया। 50+ शहरों में सफाई कार्य संपन्न हुआ।",
    content: `
      <p>राष्ट्रीय सेवा संघ के राष्ट्रव्यापी स्वच्छता अभियान का सफल समापन हुआ।</p>
    `,
    image:
      "/live/img-12.jpg",
    category: "Social Work",
    author: {
      name: "अमित वर्मा",
      image: "/placeholder-avatar.jpg",
      role: "पर्यावरण संयोजक",
    },
    date: "2025-01-08",
    readTime: "4 min",
    tags: ["Cleanliness", "Environment", "Campaign"],
    featured: false,
  },
  {
    id: 4,
    title: "नई वेबसाइट लॉन्च की घोषणा",
    slug: "new-website-launch",
    excerpt:
      "राष्ट्रीय सेवा संघ ने अपनी नई आधुनिक वेबसाइट लॉन्च की है। अब सदस्यों के लिए ऑनलाइन पंजीकरण और सेवाएं उपलब्ध हैं।",
    content: `
      <p>राष्ट्रीय सेवा संघ ने अपने डिजिटल परिवर्तन की दिशा में एक महत्वपूर्ण कदम उठाते हुए अपनी नई वेबसाइट लॉन्च की है।</p>
    `,
    image:
      "/live/img-13.jpg",
    category: "Updates",
    author: {
      name: "विकास पाटिल",
      image: "/placeholder-avatar.jpg",
      role: "तकनीकी प्रमुख",
    },
    date: "2025-01-05",
    readTime: "3 min",
    tags: ["Technology", "Website", "Digital"],
    featured: false,
  },
  {
    id: 5,
    title: "युवा नेतृत्व कार्यशाला 2025",
    slug: "youth-leadership-workshop",
    excerpt:
      "18-25 वर्ष के युवाओं के लिए विशेष नेतृत्व विकास कार्यशाला का आयोजन। पंजीकरण अब खुला है।",
    content: `
      <p>युवा शक्ति को सशक्त बनाने के उद्देश्य से राष्ट्रीय सेवा संघ युवा नेतृत्व कार्यशाला का आयोजन कर रहा है।</p>
    `,
    image:
      "/live/img-14.jpg",
    category: "Events",
    author: {
      name: "नेहा गुप्ता",
      image: "/placeholder-avatar.jpg",
      role: "युवा संयोजक",
    },
    date: "2025-01-03",
    readTime: "6 min",
    tags: ["Youth", "Leadership", "Workshop"],
    featured: false,
  },
  {
    id: 6,
    title: "वृक्षारोपण महाअभियान - 1 लाख पेड़ लगाए गए",
    slug: "tree-plantation-drive",
    excerpt:
      "राष्ट्रीय सेवा संघ के सदस्यों ने पिछले तीन महीनों में 1 लाख से अधिक पेड़ लगाए। पर्यावरण संरक्षण में बड़ी सफलता।",
    content: `
      <p>पर्यावरण संरक्षण के प्रति अपनी प्रतिबद्धता को दोहराते हुए, राष्ट्रीय सेवा संघ ने वृक्षारोपण में एक बड़ी उपलब्धि हासिल की है।</p>
    `,
    image:
      "/live/img-15.jpg",
    category: "Social Work",
    author: {
      name: "संजय मेहता",
      image: "/placeholder-avatar.jpg",
      role: "पर्यावरण प्रमुख",
    },
    date: "2025-01-01",
    readTime: "5 min",
    tags: ["Environment", "Plantation", "Green India"],
    featured: true,
  },
];
