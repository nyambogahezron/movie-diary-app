import { ContentItem, Genre, Profile, User, WatchHistoryItem, WatchlistItem } from '../types';

// Mock Genres
export const genres: Genre[] = [
  { id: '1', name: 'Action' },
  { id: '2', name: 'Comedy' },
  { id: '3', name: 'Drama' },
  { id: '4', name: 'Fantasy' },
  { id: '5', name: 'Horror' },
  { id: '6', name: 'Romance' },
  { id: '7', name: 'Sci-Fi' },
  { id: '8', name: 'Thriller' },
  { id: '9', name: 'Documentary' },
];

// Mock Content
export const content: ContentItem[] = [
  {
    id: '1',
    title: 'Cosmic Odyssey',
    description: 'A team of astronauts embarks on a dangerous mission to save humanity from an impending cosmic threat.',
    releaseYear: 2023,
    genre: ['Sci-Fi', 'Action', 'Drama'],
    maturityRating: 'PG-13',
    duration: '2h 28m',
    thumbnailUrl: 'https://images.pexels.com/photos/956981/milky-way-starry-sky-night-sky-star-956981.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'movie',
    trending: true,
  },
  {
    id: '2',
    title: 'Kingdom of Shadows',
    description: 'In a medieval fantasy world, a young warrior must unite warring kingdoms against an ancient evil.',
    releaseYear: 2022,
    genre: ['Fantasy', 'Action', 'Drama'],
    maturityRating: 'TV-14',
    duration: '10 Episodes',
    thumbnailUrl: 'https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/1693095/pexels-photo-1693095.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'series',
  },
  {
    id: '3',
    title: 'Midnight Detectives',
    description: 'Two detectives with opposing methods must work together to solve a series of mysterious murders.',
    releaseYear: 2023,
    genre: ['Thriller', 'Drama', 'Mystery'],
    maturityRating: 'TV-MA',
    duration: '8 Episodes',
    thumbnailUrl: 'https://images.pexels.com/photos/2486168/pexels-photo-2486168.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'series',
    new: true,
  },
  {
    id: '4',
    title: 'The Last Stand',
    description: 'A retired special forces operative is forced back into action when his family is threatened.',
    releaseYear: 2023,
    genre: ['Action', 'Thriller'],
    maturityRating: 'R',
    duration: '1h 56m',
    thumbnailUrl: 'https://images.pexels.com/photos/1552212/pexels-photo-1552212.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'movie',
    trending: true,
  },
  {
    id: '5',
    title: 'Heart of the City',
    description: 'A coming-of-age story about a young artist finding her voice in the bustling metropolis.',
    releaseYear: 2022,
    genre: ['Drama', 'Romance'],
    maturityRating: 'PG-13',
    duration: '2h 12m',
    thumbnailUrl: 'https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/1604141/pexels-photo-1604141.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'movie',
  },
  {
    id: '6',
    title: 'Whispers of the Past',
    description: 'A historian uncovers a centuries-old conspiracy that could change the course of history.',
    releaseYear: 2023,
    genre: ['Mystery', 'Thriller', 'Drama'],
    maturityRating: 'TV-14',
    duration: '6 Episodes',
    thumbnailUrl: 'https://images.pexels.com/photos/3243027/pexels-photo-3243027.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/1029622/pexels-photo-1029622.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'series',
    new: true,
  },
  {
    id: '7',
    title: 'Future Shock',
    description: 'In a dystopian future, a group of rebels fights against an oppressive regime controlling humanity.',
    releaseYear: 2022,
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    maturityRating: 'TV-MA',
    duration: '10 Episodes',
    thumbnailUrl: 'https://images.pexels.com/photos/2582815/pexels-photo-2582815.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/844297/pexels-photo-844297.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'series',
  },
  {
    id: '8',
    title: 'Laughter Therapy',
    description: 'A stand-up comedian navigates life, love, and career in this hilarious comedy series.',
    releaseYear: 2023,
    genre: ['Comedy', 'Romance'],
    maturityRating: 'TV-14',
    duration: '8 Episodes',
    thumbnailUrl: 'https://images.pexels.com/photos/1086178/pexels-photo-1086178.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'series',
  },
  {
    id: '9',
    title: 'Wilderness Survival',
    description: 'After a plane crash, survivors must navigate the harsh wilderness while uncovering dark secrets.',
    releaseYear: 2022,
    genre: ['Drama', 'Thriller', 'Mystery'],
    maturityRating: 'TV-MA',
    duration: '12 Episodes',
    thumbnailUrl: 'https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/1666012/pexels-photo-1666012.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'series',
    trending: true,
  },
  {
    id: '10',
    title: 'Culinary Journeys',
    description: 'A renowned chef travels the world exploring exotic cuisines and cultural traditions.',
    releaseYear: 2023,
    genre: ['Documentary', 'Reality'],
    maturityRating: 'TV-PG',
    duration: '10 Episodes',
    thumbnailUrl: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'series',
    new: true,
  },
  {
    id: '11',
    title: 'The Art of Deception',
    description: 'A master con artist takes on one last job, but nothing is as it seems in this thrilling heist movie.',
    releaseYear: 2022,
    genre: ['Crime', 'Thriller', 'Drama'],
    maturityRating: 'R',
    duration: '2h 8m',
    thumbnailUrl: 'https://images.pexels.com/photos/2228555/pexels-photo-2228555.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'movie',
  },
  {
    id: '12',
    title: 'Ocean Depths',
    description: 'A team of marine biologists discovers an unprecedented phenomenon in the ocean depths.',
    releaseYear: 2023,
    genre: ['Documentary', 'Science'],
    maturityRating: 'TV-PG',
    duration: '6 Episodes',
    thumbnailUrl: 'https://images.pexels.com/photos/3100361/pexels-photo-3100361.jpeg',
    backdropUrl: 'https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg',
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    type: 'series',
  },
];

// Default user with profiles
export const defaultUser: User = {
  id: '1',
  email: 'user@example.com',
  profiles: [
    {
      id: '1',
      name: 'Main Profile',
      avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg',
    },
    {
      id: '2',
      name: 'Kids',
      avatar: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
    },
    {
      id: '3',
      name: 'Guest',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    },
  ],
};

// Default watchlist
export const defaultWatchlist: WatchlistItem[] = [
  {
    contentId: '1',
    profileId: '1',
    addedAt: Date.now() - 86400000 * 2, // 2 days ago
  },
  {
    contentId: '3',
    profileId: '1',
    addedAt: Date.now() - 86400000 * 1, // 1 day ago
  },
  {
    contentId: '6',
    profileId: '1',
    addedAt: Date.now() - 86400000 * 3, // 3 days ago
  },
];

// Default watch history
export const defaultWatchHistory: WatchHistoryItem[] = [
  {
    contentId: '2',
    profileId: '1',
    progress: 0.4, // 40% watched
    timestamp: Date.now() - 86400000 * 1, // 1 day ago
  },
  {
    contentId: '4',
    profileId: '1',
    progress: 0.7, // 70% watched
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
  },
  {
    contentId: '9',
    profileId: '1',
    progress: 0.2, // 20% watched
    timestamp: Date.now() - 86400000 * 3, // 3 days ago
  },
];

// Helper functions to simulate API calls
export const getContentById = (id: string): ContentItem | undefined => {
  return content.find(item => item.id === id);
};

export const getContentByGenre = (genreName: string): ContentItem[] => {
  return content.filter(item => item.genre.includes(genreName));
};

export const getTrendingContent = (): ContentItem[] => {
  return content.filter(item => item.trending === true);
};

export const getNewContent = (): ContentItem[] => {
  return content.filter(item => item.new === true);
};

export const searchContent = (query: string): ContentItem[] => {
  const lowerQuery = query.toLowerCase();
  return content.filter(
    item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.description.toLowerCase().includes(lowerQuery) ||
      item.genre.some(g => g.toLowerCase().includes(lowerQuery))
  );
};