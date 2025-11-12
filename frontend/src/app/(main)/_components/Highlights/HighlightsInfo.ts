export interface HighlightCounter {
  id: string;
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  icon?: string;
  color?: 'orange' | 'blue' | 'green' | 'purple';
  backgroundImage?: string;
}

export interface HighlightsSection {
  subtitle?: string;
  counters: HighlightCounter[];
}

export const highlightsData: HighlightsSection = {
  subtitle: "Witness the Transformative Power of Our Ground-Level Seva and National Initiatives.",
  counters: [
    {
      id: "states",
      title: "ACTIVE STATE'S",
      value: 15,
      suffix: "+",
      duration: 4000,
      icon: "🗺️",
      color: "orange",
      backgroundImage: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-05-at-3.03.54-PM-scaled.webp"
    },
    {
      id: "members",
      title: "ACTIVE MEMBERS",
      value: 50000,
      suffix: "+",
      duration: 4000,
      icon: "👥",
      color: "blue",
      backgroundImage: "https://joinrss.org.in/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-30-at-9.36.56-PM-e1754387362546.jpeg"
    },
    {
      id: "volunteers",
      title: "ACTIVE VOLUNTEERS",
      value: 1000,
      suffix: "+",
      duration: 4000,
      icon: "🙋‍♂️",
      color: "green",
      backgroundImage: "https://joinrss.org.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-05-at-3.03.54-PM-1-scaled.webp"
    }
  ]
};


export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

export const animationConfig = {
  duration: 4000,
  easing: 'ease-out',
  delay: 200, 
};