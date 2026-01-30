// Mock data for IvyReader development
import type { Book, ReadingSession, UserStats, SocialPost, LeaderboardEntry, TrendingBook, WeeklyVolume } from './types';

export const mockCurrentBook: Book = {
  id: '1',
  title: 'Determined: A Science of Life without Free Will',
  author: 'Robert Sapolsky',
  category: 'Neuroscience',
  totalPages: 500,
  coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
  currentPage: 320,
  status: 'reading',
  startedAt: new Date('2024-10-01'),
  createdAt: new Date('2024-10-01'),
  updatedAt: new Date(),
};

export const mockQueueBooks: Book[] = [
  {
    id: '2',
    title: 'The Almanack of Naval Ravikant',
    author: 'Eric Jorgenson',
    category: 'Philosophy',
    totalPages: 242,
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    currentPage: 0,
    status: 'queue',
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-15'),
  },
  {
    id: '3',
    title: 'Outlive: The Science and Art of Longevity',
    author: 'Peter Attia',
    category: 'Health',
    totalPages: 496,
    coverUrl: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=400&h=600&fit=crop',
    currentPage: 0,
    status: 'queue',
    createdAt: new Date('2024-10-16'),
    updatedAt: new Date('2024-10-16'),
  },
  {
    id: '4',
    title: "Poor Charlie's Almanack",
    author: 'Charlie Munger',
    category: 'Finance',
    totalPages: 548,
    coverUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=600&fit=crop',
    currentPage: 0,
    status: 'queue',
    createdAt: new Date('2024-10-17'),
    updatedAt: new Date('2024-10-17'),
  },
];

export const mockUserStats: UserStats = {
  currentStreak: 12,
  averageStreak: 10,
  pagesReadQuarterly: 1240,
  percentileRanking: 95,
  focusScore: 94.2,
  totalTimeInvestedMinutes: 2900, // 48h 20m
  dailyGoalMinutes: 60,
  todayMinutes: 45,
};

export const mockWeeklyVolume: WeeklyVolume[] = [
  { day: 'M', minutes: 45 },
  { day: 'T', minutes: 60 },
  { day: 'W', minutes: 30 },
  { day: 'T', minutes: 55 },
  { day: 'F', minutes: 40 },
  { day: 'S', minutes: 35 },
  { day: 'S', minutes: 25 },
];

export const mockSocialPosts: SocialPost[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'James D.',
    userAvatar: undefined,
    content: 'Just finished Meditations. Essential reading for maintaining stoic calm in high-pressure environments. A must-read for Q4.',
    bookId: 'book1',
    bookTitle: 'Meditations',
    bookAuthor: 'Marcus Aurelius',
    rating: 5,
    likes: 24,
    comments: 5,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isLiked: false,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah K.',
    userAvatar: undefined,
    content: 'Hit a 30-day reading streak! Consistency is the only algorithm that matters.',
    likes: 156,
    comments: 12,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isLiked: true,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Michael R.',
    userAvatar: undefined,
    content: 'Starting "The Beginning of Infinity". Ready to have my worldview reconstructed.',
    bookId: 'book2',
    bookTitle: 'The Beginning of Infinity',
    bookAuthor: 'David Deutsch',
    likes: 42,
    comments: 8,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isLiked: false,
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'user4', userName: 'Elena R.', pagesRead: 450 },
  { rank: 2, userId: 'user5', userName: 'David K.', pagesRead: 380 },
  { rank: 3, userId: 'current', userName: 'Marcus A.', pagesRead: 320 },
  { rank: 4, userId: 'user2', userName: 'Sarah K.', pagesRead: 290 },
  { rank: 5, userId: 'user1', userName: 'James D.', pagesRead: 210 },
];

export const mockTrendingBooks: TrendingBook[] = [
  {
    bookId: 'trending1',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Psychology',
    activeReaders: 12,
  },
  {
    bookId: 'trending2',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    activeReaders: 8,
  },
  {
    bookId: 'trending3',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'History',
    activeReaders: 6,
  },
];

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export function formatDate(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[now.getDay()].toUpperCase();
  const monthName = months[now.getMonth()].toUpperCase();
  const date = now.getDate();
  
  // Calculate quarter
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  
  return `${dayName}, ${monthName} ${date} • Q${quarter} PERFORMANCE`;
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return '1d ago';
  return `${diffDays}d ago`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}
