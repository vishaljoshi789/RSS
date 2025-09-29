export interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  category: 'founders' | 'state-team';
  state?: string;
  bio?: string;
}


export const foundersTeam: TeamMember[] = [
  {
    id: "1605",
    name: "श्री योगी आदित्यनाथ महाराज जी",
    position: "मुख्य प्रेरणा स्रोत एवं मार्गदर्शक",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-12-at-6.26.10-PM-1-1024x1024.webp",
    category: 'founders',
    bio: "Chief inspiration and guiding force of the organization"
  },
  {
    id: "1610",
    name: "स्वामी श्री दर्शन भारती जी",
    position: "राष्ट्रीय संरक्षक",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-12-at-6.26.10-PM-1024x1024.webp",
    category: 'founders',
    bio: "National Patron of Rashtriya Seva Sangh"
  },
  {
    id: "1614",
    name: "श्री हिमांशु जोशी",
    position: "संस्थापक/राष्ट्रीय अध्यक्ष",
    image: "https://joinrss.org.in/wp-content/uploads/2025/07/Picsart_25-07-21_14-58-16-109-1024x1024.jpg",
    category: 'founders',
    bio: "Founder and National President of Rashtriya Seva Sangh"
  },
  {
    id: "1615",
    name: "श्री वेदमणि शुक्ला",
    position: "राष्ट्रीय महामंत्री",
    image: "https://joinrss.org.in/wp-content/uploads/2025/07/Picsart_25-07-26_18-09-52-227-1024x1024.jpg",
    category: 'founders',
    bio: "National General Secretary"
  },
  {
    id: "1616",
    name: "श्री सुनील दत्त पंत",
    position: "राष्ट्रीय संगठन मंत्री",
    image: "https://joinrss.org.in/wp-content/uploads/2025/07/Picsart_25-07-21_14-50-22-976-1024x1024.jpg",
    category: 'founders',
    bio: "National Organization Minister"
  },
  {
    id: "1617",
    name: "श्री बी प्रसाद जोशी",
    position: "राष्ट्रीय सचिव",
    image: "https://joinrss.org.in/wp-content/uploads/2025/07/Picsart_25-07-30_21-27-44-593-1024x1024.jpg",
    category: 'founders',
    bio: "National Secretary"
  }
];


export const stateTeam: TeamMember[] = [
  {
    id: "2202",
    name: "श्री अक्षय कुमार तिवारी",
    position: "जिलाध्यक्ष भदोही",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-14-at-12.49.56-PM-300x300.jpeg",
    category: 'state-team',
    state: "उत्तर प्रदेश"
  },
  {
    id: "1646",
    name: "श्री निलेश धन्यकुमार घुगे",
    position: "प्रदेश अध्यक्ष",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-12-at-8.00.01-PM-1-e1755074995500-300x300.webp",
    category: 'state-team',
    state: "महाराष्ट्र"
  },
  {
    id: "2201",
    name: "श्री प्रदीप कुमार तिवारी",
    position: "प्रदेश उपाध्यक्ष",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-14-at-12.49.56-PM-1-e1755202987998-300x300.jpeg",
    category: 'state-team',
    state: "मध्य प्रदेश"
  },
  {
    id: "2187",
    name: "श्री भारतेन्दु पाठक",
    position: "प्रदेश महासचिव",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-14-at-12.49.57-PM-2-300x300.jpeg",
    category: 'state-team',
    state: "उत्तराखंड"
  },
  {
    id: "2195",
    name: "श्री रणवीर सिंह रावत",
    position: "अध्यक्ष गढ़वाल मंडल",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-14-at-12.49.59-PM-300x300.jpeg",
    category: 'state-team',
    state: "उत्तराखंड"
  },
  {
    id: "2199",
    name: "श्री रितेश चमोली",
    position: "जिला मंत्री, टिहरी गढ़वाल",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-14-at-12.49.57-PM-1-e1755203013249-300x300.jpeg",
    category: 'state-team',
    state: "उत्तराखंड"
  },
  {
    id: "1643",
    name: "श्री विनय पाठक",
    position: "प्रदेश संगठन मंत्री",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-12-at-8.00.01-PM-e1755009102961-300x300.webp",
    category: 'state-team',
    state: "उत्तर प्रदेश"
  },
  {
    id: "1641",
    name: "श्री विवर तिवारी",
    position: "प्रदेश अध्यक्ष",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/1419260419264551-e1755008972710-300x300.webp",
    category: 'state-team',
    state: "मध्य प्रदेश"
  },
  {
    id: "2200",
    name: "श्री शेखर यादव",
    position: "जिलाध्यक्ष गाजियाबाद",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-14-at-12.49.57-PM-278x300.jpeg",
    category: 'state-team',
    state: "उत्तर प्रदेश"
  },
  {
    id: "1823",
    name: "श्री सन सुपय्या तेवर",
    position: "प्रदेश अध्यक्ष",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-13-at-2.43.56-PM-e1755079640611-289x300.webp",
    category: 'state-team',
    state: "तमिलनाडु"
  },
  {
    id: "1636",
    name: "श्री सोनू ठाकुर",
    position: "प्रदेश महामंत्री",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-07-31-at-9.08.05-PM-2-e1755007078118-300x300.webp",
    category: 'state-team',
    state: "उत्तर प्रदेश"
  },
  {
    id: "2197",
    name: "स्वामी श्री संतोष मुनि शास्त्री",
    position: "प्रदेश संगठन मंत्री, धर्माचार्य प्रकोष्ठ",
    image: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-14-at-12.49.58-PM-300x300.jpeg",
    category: 'state-team',
    state: "उत्तराखंड"
  }
];


export const allTeamMembers: TeamMember[] = [...foundersTeam, ...stateTeam];


export const getTeamMembersByCategory = (category: 'founders' | 'state-team'): TeamMember[] => {
  return allTeamMembers.filter(member => member.category === category);
};


export const getTeamMembersByState = (state: string): TeamMember[] => {
  return stateTeam.filter(member => member.state === state);
};


export const getUniqueStates = (): string[] => {
  const states = stateTeam.map(member => member.state).filter(Boolean) as string[];
  return [...new Set(states)].sort();
};


export const pageContent = {
  title: "Founders & Team Members",
  subtitle: "संस्थापक एवं टीम सदस्य",
  description: "Meet our dedicated leadership team and state coordinators who work tirelessly for the betterment of society through Rashtriya Seva Sangh.",
  foundersSection: {
    title: "Core Leadership Team",
    subtitle: "मुख्य नेतृत्व टीम"
  },
  stateTeamSection: {
    title: "State Team Members",
    subtitle: "राज्य टीम सदस्य"
  }
};