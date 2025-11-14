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
    image: "/people/yogi_ji.jpg",
    category: 'founders',
    bio: "Chief inspiration and guiding force of the organization"
  },
  {
    id: "1610",
    name: "स्वामी श्री दर्शन भारती जी",
    position: "राष्ट्रीय संरक्षक",
    image: "/people/darshan.jpg",
    category: 'founders',
    bio: "National Patron of Rashtriya Seva Sangh"
  },
  {
    id: "1614",
    name: "श्री हिमांशु जोशी",
    position: "संस्थापक/राष्ट्रीय अध्यक्ष",
    image: "/people/himanshu_joshi.jpg",
    category: 'founders',
    bio: "Founder and National President of Rashtriya Seva Sangh"
  },
  {
    id: "1615",
    name: "श्री वेदमणि शुक्ला",
    position: "राष्ट्रीय महामंत्री",
    image:  "/people/vedmani.jpg",
    category: 'founders',
    bio: "National General Secretary"
  },
  {
    id: "1616",
    name: "श्री सुनील दत्त पंत",
    position: "राष्ट्रीय संगठन मंत्री",
    image: "/people/sunil_datt.jpg",
    category: 'founders',
    bio: "National Organization Minister"
  },
  {
    id: "1617",
    name: "श्री बी प्रसाद जोशी",
    position: "राष्ट्रीय सचिव",
    image:  "/people/prashad.jpg",
    category: 'founders',
    bio: "National Secretary"
  }
];


export const stateTeam: TeamMember[] = [];


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
  heroImage: {
    url: "http://joinrss.org.in/wp-content/uploads/2025/07/Picsart_25-07-21_14-58-16-109-1024x1024.jpg",
    alt: "हमारी टीम - राष्ट्रीय सेवा संघ"
  },
  foundersSection: {
    title: "Core Leadership Team",
    subtitle: "मुख्य नेतृत्व टीम"
  },
  stateTeamSection: {
    title: "State Team Members",
    subtitle: "राज्य टीम सदस्य"
  }
};