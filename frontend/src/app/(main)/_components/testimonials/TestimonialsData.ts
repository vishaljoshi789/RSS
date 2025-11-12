export interface Testimonial {
  id: number;
  name: string;
  nameHindi: string;
  role: string;
  roleHindi: string;
  image: string;
  quote: string;
  quoteHindi: string;
  location: string;
}

export const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar Sharma",
    nameHindi: "राजेश कुमार शर्मा",
    role: "Social Worker",
    roleHindi: "समाज सेवक",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    quote: "Joining Rashtriya Seva Sangh has been a transformative experience. The dedication towards preserving our culture and serving society is truly inspiring.",
    quoteHindi: "राष्ट्रीय सेवा संघ से जुड़ना एक परिवर्तनकारी अनुभव रहा है। हमारी संस्कृति को संरक्षित करने और समाज की सेवा करने का समर्पण वास्तव में प्रेरणादायक है।",
    location: "Delhi"
  },
  {
    id: 2,
    name: "Priya Singh",
    nameHindi: "प्रिया सिंह",
    role: "Teacher",
    roleHindi: "शिक्षिका",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "The work being done by RSS for women empowerment and education is commendable. I'm proud to be associated with this noble cause.",
    quoteHindi: "महिला सशक्तिकरण और शिक्षा के लिए संघ द्वारा किया जा रहा कार्य सराहनीय है। मुझे इस महान उद्देश्य से जुड़े होने पर गर्व है।",
    location: "Mumbai"
  },
  {
    id: 3,
    name: "Amit Patel",
    nameHindi: "अमित पटेल",
    role: "Youth Volunteer",
    roleHindi: "युवा स्वयंसेवक",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    quote: "RSS has given me a platform to contribute meaningfully to nation-building. The values and principles taught here are invaluable.",
    quoteHindi: "संघ ने मुझे राष्ट्र निर्माण में सार्थक योगदान देने का मंच दिया है। यहां सिखाए गए मूल्य और सिद्धांत अमूल्य हैं।",
    location: "Gujarat"
  },
  {
    id: 4,
    name: "Sunita Devi",
    nameHindi: "सुनीता देवी",
    role: "Community Leader",
    roleHindi: "समुदाय नेता",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    quote: "The selfless service and dedication of RSS members towards society is remarkable. Together we are building a stronger India.",
    quoteHindi: "समाज के प्रति संघ के सदस्यों की निस्वार्थ सेवा और समर्पण उल्लेखनीय है। साथ मिलकर हम एक मजबूत भारत का निर्माण कर रहे हैं।",
    location: "Uttar Pradesh"
  },
  {
    id: 5,
    name: "Vikram Rao",
    nameHindi: "विक्रम राव",
    role: "Business Owner",
    roleHindi: "व्यवसायी",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    quote: "RSS's focus on unity, integrity, and cultural preservation resonates deeply with me. It's an honor to support their initiatives.",
    quoteHindi: "एकता, अखंडता और सांस्कृतिक संरक्षण पर संघ का ध्यान मुझे गहराई से प्रभावित करता है। उनकी पहल का समर्थन करना एक सम्मान है।",
    location: "Bangalore"
  },
  {
    id: 6,
    name: "Meera Reddy",
    nameHindi: "मीरा रेड्डी",
    role: "Healthcare Worker",
    roleHindi: "स्वास्थ्य कार्यकर्ता",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    quote: "The humanitarian work and relief efforts by RSS during emergencies showcase their true commitment to serving humanity.",
    quoteHindi: "आपात स्थिति के दौरान संघ द्वारा किए गए मानवीय कार्य और राहत प्रयास मानवता की सेवा के प्रति उनकी सच्ची प्रतिबद्धता को दर्शाते हैं।",
    location: "Hyderabad"
  }
];
