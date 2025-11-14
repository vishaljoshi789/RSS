export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: 'event' | 'training' | 'ceremony' | 'other';
  uploadDate: string;
}

export interface VideoCategory {
  key: string;
  label: string;
  icon: string;
}

export const videoCategories: VideoCategory[] = [
  { key: 'all', label: 'All Videos', icon: '🎬' },
  { key: 'event', label: 'Events', icon: '🎉' },
  { key: 'training', label: 'Training', icon: '📚' },
  { key: 'ceremony', label: 'Ceremonies', icon: '🎭' },
  { key: 'other', label: 'Other', icon: '📹' }
];

// Placeholder video data - will be updated when you provide real video details
export const videosData: VideoItem[] = [
  {
    id: 'vid-1',
    title: '1000983530 (1)',
    description: 'RSS Community Event - Annual gathering showcasing our activities and achievements',
    thumbnailUrl: '/live/img-08.jpg',
    videoUrl: 'https://www.youtube.com/embed/V4LKXYnsPS8?feature=oembed&autoplay=1&rel=0&controls=0',
    duration: '5:30',
    category: 'event',
    uploadDate: '2025-07-30'
  },
  {
    id: 'vid-2',
    title: '1000935059 (1)',
    description: 'Training and Development Program - Key moments from our educational initiatives',
    thumbnailUrl: '/live/img-09.jpg',
    videoUrl: 'https://www.youtube.com/embed/0BeY2LfCaVM?feature=oembed&autoplay=1&rel=0&controls=0',
    duration: '8:15',
    category: 'training',
    uploadDate: '2025-07-30'
  },
  {
    id: 'vid-3',
    title: 'WhatsApp Image 2025-08-05 at 6.28.14 PM',
    description: 'Religious Ceremony Documentation - Spiritual activities and religious observances',
    thumbnailUrl: '/live/img-10.jpg',
    videoUrl: 'https://www.youtube.com/embed/6FUfr9Gp0bc?feature=oembed&autoplay=1&rel=0&controls=0',
    duration: '12:45',
    category: 'ceremony',
    uploadDate: '2025-08-05'
  },
  {
    id: 'vid-4',
    title: 'WhatsApp Image 2025-08-05 at 6.36.33 PM',
    description: 'Community Ceremony - Traditional rituals and community participation',
    thumbnailUrl: '/live/img-11.jpg',
    videoUrl: 'https://www.youtube.com/embed/3J1Os--UZ4w?feature=oembed&autoplay=1&rel=0&controls=0',
    duration: '6:20',
    category: 'ceremony',
    uploadDate: '2025-08-05'
  },
  {
    id: 'vid-5',
    title: 'WhatsApp Image 2025-08-09 at 9.01.44 PM',
    description: 'Cultural Festival Moments - Celebrating our rich heritage and traditions',
    thumbnailUrl: '/live/img-12.jpg',
    videoUrl: 'https://www.youtube.com/embed/KzJcrAx-l1c?feature=oembed&autoplay=1&rel=0&controls=0',
    duration: '7:45',
    category: 'event',
    uploadDate: '2025-08-09'
  }
];

// Utility functions
export const getVideosByCategory = (category: string): VideoItem[] => {
  if (category === 'all') return videosData;
  return videosData.filter(video => video.category === category);
};

export const formatDuration = (duration: string): string => {
  return duration;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
