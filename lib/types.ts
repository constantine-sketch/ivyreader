// IvyReader Data Types

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  totalPages: number;
  coverUrl?: string;
  currentPage: number;
  status: 'reading' | 'queue' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  userId: string;
  startPage: number;
  endPage: number;
  durationMinutes: number;
  notes?: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  bookId: string;
  userId: string;
  content: string;
  pageNumber?: number;
  createdAt: Date;
}

export interface UserStats {
  currentStreak: number;
  averageStreak: number;
  pagesReadQuarterly: number;
  percentileRanking: number;
  focusScore: number;
  totalTimeInvestedMinutes: number;
  dailyGoalMinutes: number;
  todayMinutes: number;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  bookId?: string;
  bookTitle?: string;
  bookAuthor?: string;
  rating?: number;
  likes: number;
  comments: number;
  createdAt: Date;
  isLiked?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  pagesRead: number;
}

export interface TrendingBook {
  bookId: string;
  title: string;
  author: string;
  category: string;
  activeReaders: number;
}

export interface WeeklyVolume {
  day: string;
  minutes: number;
}
