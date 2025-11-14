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
      backgroundImage: "/live/img-08.jpg"
    },
    {
      id: "members",
      title: "ACTIVE MEMBERS",
      value: 50000,
      suffix: "+",
      duration: 4000,
      icon: "👥",
      color: "blue",
      backgroundImage: "/live/img-09.jpg"
    },
    {
      id: "volunteers",
      title: "ACTIVE VOLUNTEERS",
      value: 1000,
      suffix: "+",
      duration: 4000,
      icon: "🙋‍♂️",
      color: "green",
      backgroundImage: "/live/img-15.jpg"
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