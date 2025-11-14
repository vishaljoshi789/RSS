export interface PhotoItem {
  id: string;
  title: string;
  category: 'religious' | 'social' | 'other';
  imageUrl: string;
  thumbnailUrl?: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export interface PhotoCategory {
  key: string;
  label: string;
  icon: string;
}

export const photoCategories: PhotoCategory[] = [
  { key: 'all', label: 'All', icon: '🖼️' },
  { key: 'religious', label: 'Religious', icon: '🕉️' },
  { key: 'social', label: 'Social', icon: '👥' },
  { key: 'other', label: 'Other', icon: '📸' }
];

export const photosData: PhotoItem[] = [
  {
    id: 'rel-1',
    title: 'Religious Ceremony 1',
    category: 'religious',
    imageUrl: '/live/img-01.jpg',
    alt: 'Religious ceremony and activities',
    width: 1920,
    height: 1080,
    aspectRatio: 1920 / 1080
  },
  {
    id: 'rel-2',
    title: 'Religious Ceremony 2',
    category: 'religious',
    imageUrl: '/live/img-02.jpg',
    alt: 'Religious ceremony and activities',
    width: 1920,
    height: 1080,
    aspectRatio: 1920 / 1080
  },
  {
    id: 'rel-3',
    title: 'Religious Ceremony 3',
    category: 'religious',
    imageUrl: '/live/img-03.jpg',
    alt: 'Religious ceremony and activities',
    width: 1920,
    height: 1080,
    aspectRatio: 1920 / 1080
  },
  {
    id: 'rel-4',
    title: 'Religious Event 4',
    category: 'religious',
    imageUrl: '/live/img-04.jpg',
    alt: 'Religious event and gathering',
    width: 1080,
    height: 608,
    aspectRatio: 1080 / 608
  },
  {
    id: 'rel-5',
    title: 'Religious Event 5',
    category: 'religious',
    imageUrl: '/live/img-05.jpg',
    alt: 'Religious event and gathering',
    width: 1280,
    height: 597,
    aspectRatio: 1280 / 597
  },
  {
    id: 'rel-6',
    title: 'Religious Gathering',
    category: 'religious',
    imageUrl: '/live/img-06.png',
    alt: 'Religious gathering and ceremony',
    width: 2560,
    height: 1441,
    aspectRatio: 2560 / 1441
  },

  // Social Photos
  {
    id: 'soc-1',
    title: 'Social Event 1',
    category: 'social',
    imageUrl: '/live/img-07.jpg',
    alt: 'Social activity and community engagement',
    width: 1246,
    height: 670,
    aspectRatio: 1246 / 670
  },
  {
    id: 'soc-2',
    title: 'Social Event 2',
    category: 'social',
    imageUrl: '/live/img-08.jpg',
    alt: 'Social activity and community engagement',
    width: 1280,
    height: 719,
    aspectRatio: 1280 / 719
  },
  {
    id: 'soc-3',
    title: 'Community Event',
    category: 'social',
    imageUrl: '/live/img-09.jpg',
    alt: 'Community event and social gathering',
    width: 2560,
    height: 1441,
    aspectRatio: 2560 / 1441
  },
  {
    id: 'soc-4',
    title: 'Social Activity 4',
    category: 'social',
    imageUrl: '/live/img-10.jpg',
    alt: 'Social activity and community work',
    width: 1252,
    height: 687,
    aspectRatio: 1252 / 687
  },
  {
    id: 'soc-5',
    title: 'Social Activity 5',
    category: 'social',
    imageUrl: '/live/img-11.jpg',
    alt: 'Social activity and community work',
    width: 1257,
    height: 674,
    aspectRatio: 1257 / 674
  },
  {
    id: 'soc-6',
    title: 'Social Activity 6',
    category: 'social',
    imageUrl: '/live/img-12.jpg',
    alt: 'Social activity and community work',
    width: 1244,
    height: 690,
    aspectRatio: 1244 / 690
  },
  {
    id: 'soc-7',
    title: 'Social Activity 7',
    category: 'social',
    imageUrl: '/live/img-13.jpg',
    alt: 'Social activity and community work',
    width: 1257,
    height: 683,
    aspectRatio: 1257 / 683
  },

  // Other Photos
  {
    id: 'oth-1',
    title: 'General Activity 1',
    category: 'other',
    imageUrl: '/live/img-14.jpg',
    alt: 'General organizational activity',
    width: 1600,
    height: 900,
    aspectRatio: 1600 / 900
  },
  {
    id: 'oth-2',
    title: 'General Activity 2',
    category: 'other',
    imageUrl: '/live/img-15.jpg',
    alt: 'General organizational activity',
    width: 1600,
    height: 900,
    aspectRatio: 1600 / 900
  },
  {
    id: 'oth-3',
    title: 'General Activity 3',
    category: 'other',
    imageUrl: '/live/img-16.jpg',
    alt: 'General organizational activity',
    width: 2560,
    height: 1441,
    aspectRatio: 2560 / 1441
  },
  {
    id: 'oth-4',
    title: 'General Activity 4',
    category: 'other',
    imageUrl: '/live/img-17.png',
    alt: 'General organizational activity',
    width: 2560,
    height: 1441,
    aspectRatio: 2560 / 1441
  }
];

// Utility functions
export const getPhotosByCategory = (category: string): PhotoItem[] => {
  if (category === 'all') return photosData;
  return photosData.filter(photo => photo.category === category);
};

export const getRandomHeight = (baseHeight: number = 250): number => {
  const variations = [0.8, 1, 1.2, 1.4, 0.9, 1.1];
  return Math.floor(baseHeight * variations[Math.floor(Math.random() * variations.length)]);
};
