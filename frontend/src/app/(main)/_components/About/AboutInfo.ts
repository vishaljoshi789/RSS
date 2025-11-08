export interface AboutData {
  title: string;
  subtitle: string;
  content: {
    quote: string;
    description: string;
    conclusion: string;
  };
  ctaText: string;
  ctaLink: string;
  image: string;
  imageAlt: string;
}

export const aboutData: AboutData = {
  title: "About Us",
  subtitle: "राष्ट्रीय सेवा संघ भारतवर्ष",
  content: {
    quote: '"जब धर्म संकट में होता है, तब संकल्पों से संगठित होती है चेतना; और जब समाज दिशाहीन हो जाता है, तब सेवा बनती है शक्ति।"',
    description: "राष्ट्रीय सेवा संघ भारतवर्ष कोई साधारण संगठन नहीं, बल्कि भारत की सनातन आत्मा का जीवंत रूप है। यह उन करोड़ों सनातनी भारतवासियों की आकांक्षाओं, पीड़ा और संकल्प का परिणाम है जो धर्म, संस्कृति और राष्ट्र की रक्षा के लिए आज भी तन-मन-धन से सक्रिय हैं।",
    conclusion: "हम संघर्षों से सीखे हैं, सेवा को जीवन बनाया है, और सनातन के लिए समर्पण को अपना धर्म।"
  },
  ctaText: "Read More",
  ctaLink: "/about-us",
  image: "/hero/about.png",
  imageAlt: "राष्ट्रीय सेवा संघ भारतवर्ष"
};