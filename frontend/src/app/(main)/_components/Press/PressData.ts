export interface PressItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publishDate: string;
  publication: string;
  category: 'newspaper' | 'magazine' | 'digital' | 'award';
}

// Extracted press coverage data from your carousel
export const pressData: PressItem[] = [
  {
    id: 'press-1',
    title: 'RSS Community Initiative Coverage',
    description: 'Major newspaper coverage of RSS community development initiatives and social programs',
    imageUrl: '/live/poster-01.jpg',
    publishDate: '2025-08-09',
    publication: 'Local Daily',
    category: 'newspaper'
  },
  {
    id: 'press-2',
    title: 'RSS Training Program Recognition',
    description: 'Press coverage highlighting the impact of RSS training and development programs',
    imageUrl: '/live/poster-02.webp',
    publishDate: '2025-08-09',
    publication: 'Regional Times',
    category: 'newspaper'
  },
  {
    id: 'press-3',
    title: 'Community Service Awards',
    description: 'Recognition for outstanding community service and social welfare activities',
    imageUrl: '/live/poster-03.webp',
    publishDate: '2025-08-09',
    publication: 'City Herald',
    category: 'award'
  },
  {
    id: 'press-4',
    title: 'Cultural Heritage Preservation',
    description: 'Media coverage of RSS efforts in preserving and promoting cultural heritage',
    imageUrl: '/live/poster-04.jpg',
    publishDate: '2025-08-09',
    publication: 'Heritage Weekly',
    category: 'magazine'
  },
  {
    id: 'press-5',
    title: 'Youth Development Program Success',
    description: 'Press coverage of successful youth development and leadership programs',
    imageUrl: '/live/poster-05.jpg',
    publishDate: '2025-08-09',
    publication: 'Youth Tribune',
    category: 'digital'
  },
  {
    id: 'press-6',
    title: 'Educational Initiative Recognition',
    description: 'Recognition for educational initiatives and scholarship programs',
    imageUrl: '/live/poster-06.jpg',
    publishDate: '2025-08-09',
    publication: 'Education Today',
    category: 'magazine'
  },
  {
    id: 'press-7',
    title: 'Social Welfare Programs',
    description: 'Coverage of comprehensive social welfare and community outreach programs',
    imageUrl: '/live/poster-07.jpg',
    publishDate: '2025-08-09',
    publication: 'Social Impact Journal',
    category: 'magazine'
  },
  {
    id: 'press-8',
    title: 'Environmental Conservation Efforts',
    description: 'Press coverage of environmental conservation and sustainability initiatives',
    imageUrl: '/live/poster-08.jpg',
    publishDate: '2025-08-09',
    publication: 'Green News',
    category: 'digital'
  },
  {
    id: 'press-9',
    title: 'Annual Achievement Awards',
    description: 'Annual awards ceremony coverage recognizing outstanding achievements',
    imageUrl: '/live/poster-09.jpg',
    publishDate: '2025-08-09',
    publication: 'Achievement Weekly',
    category: 'award'
  },
];

// Press categories for filtering
export const pressCategories = [
  { key: 'all', label: 'All Coverage', icon: '📰' },
  { key: 'newspaper', label: 'Newspapers', icon: '📰' },
  { key: 'magazine', label: 'Magazines', icon: '📖' },
  { key: 'digital', label: 'Digital Media', icon: '💻' },
  { key: 'award', label: 'Awards', icon: '🏆' }
];

// Utility functions
export const getPressByCategory = (category: string): PressItem[] => {
  if (category === 'all') return pressData;
  return pressData.filter(item => item.category === category);
};

export const formatPressDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

export const getRecentPress = (count: number = 6): PressItem[] => {
  return pressData
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, count);
};