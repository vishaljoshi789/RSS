export interface Member {
  id: number;
  name: string;
  designation: string;
  photo: string;
  quote: string;
}

export interface FounderData {
  title: string;
  description: string;
  objective: string;

  callToAction: string;
  members: Member[];
}

export const founderInfo: FounderData = {
  title: "राष्ट्रीय नेतृत्व, जो धर्म-संस्कृति और राष्ट्रसेवा की दिशा तय करता है।",
  description:
    "वेदिक आदर्शों से संचालित समर्पित नेतृत्व — सेवा, संगठन और संस्कार का आधार।",
  objective:
    "राष्ट्रभावना, सेवा और एकता को मजबूत करना, और युवा शक्ति को राष्ट्र निर्माण में जोड़ना।",

  callToAction:
    "आइए, साथ मिलकर समाज को नई दिशा दें और भारत को सशक्त बनाएं।",
  members: [
    // {
    //   id: 1,
    //   name: "प. पू. डॉ. केशव बलिराम हेडगेवार जी",
    //   designation: "मुख्य प्रेरणा स्रोत",
    //   photo: "/people/keshav_ji.jpg",
    //   quote: "संगठन ही शक्ति का आधार है।\nराष्ट्र सेवा ही सच्ची पूजा है।",
    // },
    {
      id: 2,
      name: "पू. योगी श्री आदित्यनाथ जी",
      designation: "मुख्य प्रेरणा स्रोत",
      photo: "/people/yogi_ji.jpg",
      quote: "राष्ट्र प्रथम, सदा सर्वप्रथम।\nसेवा, समर्पण और संकल्प से ही राष्ट्र का उत्थान संभव है।",
    },
    {
      id: 3,
      name: "पू. स्वामी श्री दर्शन भारती जी",
      designation: "मुख्य संरक्षक",
      photo: "/people/darshan.jpg",
      quote: "धर्म की रक्षा ही राष्ट्र की रक्षा है।\nसंस्कृति और परंपरा हमारी पहचान हैं।",
    },
    {
      id: 4,
      name: "श्री हिमांशु जोशी",
      designation: "संस्थापक एवं राष्ट्रीय अध्यक्ष",
      photo: "/people/himanshu_joshi.jpg",
      quote: "सेवा ही सबसे बड़ा धर्म है।\nराष्ट्र निर्माण में हर नागरिक की भूमिका महत्वपूर्ण है।",
    },
    {
      id: 5,
      name: "श्री पवन जोशी",
      designation: "रा. वरिष्ठ उपाध्यक्ष",
      photo: "/people/pawan_joshi.jpg",
      quote: "समाज सेवा में ही जीवन की सार्थकता है।\nएकता और समर्पण से हर लक्ष्य संभव है।",
    },
    {
      id: 6,
      name: "श्री सुनील दत्त पंत",
      designation: "रा. संगठन मंत्री",
      photo: "/people/sunil_datt.jpg",
      quote: "संगठन की मजबूती ही संघ की शक्ति है।\nहर कार्यकर्ता राष्ट्र निर्माण का स्तंभ है।",
    },
    {
      id: 7,
      name: "श्री वेदमणि शुक्ला",
      designation: "रा. महामंत्री",
      photo: "/people/vedmani.jpg",
      quote: "कर्तव्यनिष्ठा ही सफलता की कुंजी है।\nसेवा भाव से ही समाज का कल्याण होता है।",
    },
    {
      id: 8,
      name: "श्री बी. प्रसाद जोशी",
      designation: "रा. सचिव",
      photo: "/people/prashad.jpg",
      quote: "अनुशासन और समर्पण से हर कार्य सिद्ध होता है।\nराष्ट्र सेवा में कोई कार्य छोटा नहीं होता।",
    },
  ],
};
