export interface OnboardingSlideData {
  id: string;
  title: string;
  description: string;
}

export const slides: OnboardingSlideData[] = [
  {
    id: 'track',
    title: 'Track Your Movies',
    description: 'Rate and log every film you watch with one tap.',
  },
  {
    id: 'history',
    title: 'View Your History',
    description: 'Explore insights about your watching habits and preferences.',
  },
  {
    id: 'watchlist',
    title: 'Never Miss a Film',
    description: 'Build and manage your personal watchlist effortlessly.',
  },
  {
    id: 'social',
    title: 'Share Your Thoughts',
    description: 'Connect with friends and share your movie journey.',
  },
];