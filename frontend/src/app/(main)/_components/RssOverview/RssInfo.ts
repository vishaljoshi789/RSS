export interface RSSInfoTab {
  id: string;
  title: string;
  icon: string;
  content: string;
  points: string[];
  image: string;
}

export const modalContent = {
  title: "संगठन परिचय वीडियो",
  subtitle: "राष्ट्रीय सेवा संघ की संपूर्ण जानकारी"
};

export const tabHindiTitles = {
  vision: "दृष्टिकोण",
  mission: "मिशन", 
  values: "मूल्य"
};

export const rssInfoData: RSSInfoTab[] = [
  {
    id: 'vision',
    title: 'दृष्टिकोण',
    icon: 'lotus',
    content: 'राष्ट्रीय स्वयंसेवक संघ का दृष्टिकोण एक सशक्त, समरस और अखंड भारत की स्थापना करना है। हमारा ध्येय भारत को एक आत्मनिर्भर और संस्कारवान राष्ट्र बनाना है जो अपनी सनातन परंपराओं पर गर्व करे।',
    points: [
      'सामाजिक एकता और भाईचारे को बढ़ावा देना',
      'भारतीय संस्कृति और मूल्यों का संरक्षण',
      'चरित्र निर्माण और नैतिक शिक्षा का प्रसार',
      'राष्ट्र सेवा की भावना का विकास',
      'धर्म, सेवा और राष्ट्र के प्रति समर्पण भाव'
    ],
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimPhJjWLO1zIdfXiQ4voKFsHVTk1OIx4VMCSXgQysyEhrgkUQ28ME0ubyf5Pt818CWirwkGSbVqbwpMShID1IyWQBiuidCZdEEAiD7qWYveJ7RgK5cA1tihd9jPspAh8vS9e4M6SbpUVjO_xtA8e-TxJgu02sLCcPo8wy69JilZw3Rlwj_-48W4KNfMZfc/w576-h360/1_dBqKtPQz9DBTVFt1tlhpsg.jpg'
  },
  {
    id: 'mission',
    title: 'मिशन',
    icon: 'flag',
    content: 'राष्ट्रीय स्वयंसेवक संघ का मिशन भारत को एक संगठित और समरस राष्ट्र बनाना है। हम समाज के हर वर्ग को जोड़कर राष्ट्र निर्माण में योगदान देते हैं।',
    points: [
      'शिक्षा: चरित्र निर्माण और राष्ट्रीय चेतना का विकास',
      'स्वास्थ्य: समुदायिक स्वास्थ्य सेवा कार्यक्रम',
      'सेवा: प्राकृतिक आपदा और सामाजिक सेवा',
      'संस्कार: भारतीय मूल्यों और परंपराओं का प्रसार',
      'महिला सशक्तिकरण और युवा मार्गदर्शन'
    ],
    image: 'https://panchjanya.com/wp-content/uploads/2024/10/add-a-heading-2024-10-11t154411.401-750x394.webp'
  },
  {
    id: 'values',
    title: 'मूल्य',
    icon: 'dharma',
    content: 'राष्ट्रीय स्वयंसेवक संघ के मूल्य सनातन धर्म और भारतीय संस्कृति से प्रेरित हैं। हमारे सिद्धांत राष्ट्र निर्माण और समाज सेवा पर आधारित हैं।',
    points: [
      'धर्मनिष्ठा: सत्य और न्याय के मार्ग पर चलना',
      'राष्ट्र सेवा: देश और समाज की उन्नति को प्राथमिकता',
      'सामाजिक समरसता: जाति, वर्ग से परे भाईचारा',
      'निःस्वार्थ सेवा: बिना किसी अपेक्षा के सेवा भाव',
      'चरित्र निर्माण: संस्कारित और आदर्श व्यक्तित्व का विकास'
    ],
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimPhJjWLO1zIdfXiQ4voKFsHVTk1OIx4VMCSXgQysyEhrgkUQ28ME0ubyf5Pt818CWirwkGSbVqbwpMShID1IyWQBiuidCZdEEAiD7qWYveJ7RgK5cA1tihd9jPspAh8vS9e4M6SbpUVjO_xtA8e-TxJgu02sLCcPo8wy69JilZw3Rlwj_-48W4KNfMZfc/w576-h360/1_dBqKtPQz9DBTVFt1tlhpsg.jpg'
  }
];