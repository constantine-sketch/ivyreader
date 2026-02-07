import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  const dsn = process.env.DATABASE_URL || process.env.DATABASE_DSN;
  if (!_db && dsn) {
    try {
      console.log("[Database] Connecting with DSN:", dsn.substring(0, 20) + "...");
      _db = drizzle(dsn);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  if (!_db && dsn) {
    console.warn("[Database] Database connection not available");
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========== IVYREADER QUERIES ==========

import { desc, and, sql, gte } from "drizzle-orm";
import {
  books,
  readingSessions,
  notes,
  userStats,
  socialPosts,
  postLikes,
  postComments,
  userFollows,
  type InsertBook,
  type InsertReadingSession,
  type InsertNote,
  type InsertUserStats,
  type InsertSocialPost,
  type InsertPostLike,
  type InsertPostComment,
  type InsertUserFollow,
} from "../drizzle/schema";

// Books
export async function getUserBooks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(books).where(eq(books.userId, userId)).orderBy(desc(books.updatedAt));
}

export async function getDemoBooks() {
  const db = await getDb();
  if (!db) return [];
  // Get books from demo users (IDs 1-10) to show as examples
  return db.select().from(books).where(sql`${books.userId} <= 10`).orderBy(desc(books.updatedAt)).limit(20);
}

export async function getBookById(bookId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
  return result[0] || null;
}

export async function createBook(data: InsertBook) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(books).values(data);
  // mysql2 returns insertId in different ways depending on the driver
  const insertId = result.insertId ?? result[0]?.insertId ?? result;
  return Number(insertId);
}

export async function updateBook(bookId: number, data: Partial<InsertBook>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(books).set({ ...data, updatedAt: new Date() }).where(eq(books.id, bookId));
}

export async function deleteBook(bookId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(books).where(eq(books.id, bookId));
}

// Reading Sessions
export async function getBookSessions(bookId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(readingSessions).where(eq(readingSessions.bookId, bookId)).orderBy(desc(readingSessions.createdAt));
}

export async function getUserSessions(userId: number, limit?: number) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(readingSessions).where(eq(readingSessions.userId, userId)).orderBy(desc(readingSessions.createdAt));
  if (limit) query = query.limit(limit) as any;
  return query;
}

export async function createReadingSession(data: InsertReadingSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(readingSessions).values(data);
  await db.update(books).set({ currentPage: data.endPage, updatedAt: new Date() }).where(eq(books.id, data.bookId));
  return Number(result.insertId);
}

// Notes
export async function getBookNotes(bookId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notes).where(eq(notes.bookId, bookId)).orderBy(desc(notes.createdAt));
}

export async function createNote(data: InsertNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(notes).values(data);
  return Number(result.insertId);
}

export async function deleteNote(noteId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(notes).where(eq(notes.id, noteId));
}

// User Stats
export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
  if (!result[0]) {
    await db.insert(userStats).values({ userId });
    const newResult = await db.select().from(userStats).where(eq(userStats.userId, userId)).limit(1);
    return newResult[0] || null;
  }
  return result[0];
}

export async function updateUserStats(userId: number, data: Partial<InsertUserStats>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(userStats).set({ ...data, updatedAt: new Date() }).where(eq(userStats.userId, userId));
}

export async function calculateUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const sessions = await getUserSessions(userId);
  const totalMinutesRead = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalPagesRead = sessions.reduce((sum, s) => sum + (s.endPage - s.startPage), 0);
  const userBooks = await getUserBooks(userId);
  const booksCompleted = userBooks.filter(b => b.status === 'completed').length;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let currentStreak = 0;
  let checkDate = new Date(today);
  
  for (let i = 0; i < 365; i++) {
    const dayStart = new Date(checkDate);
    const dayEnd = new Date(checkDate);
    dayEnd.setHours(23, 59, 59, 999);
    const daySessions = sessions.filter(s => {
      const sessionDate = new Date(s.createdAt);
      return sessionDate >= dayStart && sessionDate <= dayEnd;
    });
    if (daySessions.length > 0) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  await updateUserStats(userId, {
    totalMinutesRead,
    totalPagesRead,
    booksCompleted,
    currentStreak,
    lastReadDate: sessions[0]?.createdAt || null,
  });
  
  return getUserStats(userId);
}

// Social Posts
export async function getSocialPosts(userId?: number, limit: number = 20, followingOnly: boolean = false, currentUserId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  let postsResult = await db.select({ post: socialPosts, book: books, user: users })
    .from(socialPosts)
    .leftJoin(books, eq(socialPosts.bookId, books.id))
    .leftJoin(users, eq(socialPosts.userId, users.id))
    .orderBy(desc(socialPosts.createdAt))
    .limit(limit * 3); // Fetch more to filter
  
  if (userId) {
    postsResult = postsResult.filter(item => item.post.userId === userId);
  }
  
  // Filter by following if requested
  if (followingOnly && currentUserId) {
    const following = await db.select().from(userFollows).where(eq(userFollows.followerId, currentUserId));
    const followingIds = following.map(f => f.followingId);
    postsResult = postsResult.filter(item => followingIds.includes(item.post.userId));
  }
  
  // Limit after filtering
  postsResult = postsResult.slice(0, limit);
  
  if (userId) {
    return postsResult;
  }
  
  // Add comment counts to each post
  const postsWithComments = await Promise.all(
    postsResult.map(async (item) => {
      const commentCount = await db.select({ count: sql`COUNT(*)` })
        .from(postComments)
        .where(eq(postComments.postId, item.post.id));
      return {
        ...item,
        comments: Number(commentCount[0]?.count || 0),
      };
    })
  );
  
  return postsWithComments;
}

export async function createSocialPost(data: InsertSocialPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(socialPosts).values(data);
  return Number(result.insertId);
}

export async function likePost(postId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(postLikes).where(
    and(eq(postLikes.postId, postId), eq(postLikes.userId, userId))
  ).limit(1);
  
  if (existing.length > 0) {
    await db.delete(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    await db.update(socialPosts).set({ likes: sql`${socialPosts.likes} - 1` }).where(eq(socialPosts.id, postId));
    return false;
  } else {
    await db.insert(postLikes).values({ postId, userId });
    await db.update(socialPosts).set({ likes: sql`${socialPosts.likes} + 1` }).where(eq(socialPosts.id, postId));
    
    // Get post author to send notification
    const post = await db.select().from(socialPosts).where(eq(socialPosts.id, postId)).limit(1);
    if (post.length > 0 && post[0].userId !== userId) {
      // Don't notify if user likes their own post
      await createNotification({
        userId: post[0].userId,
        type: "like",
        title: "New Like",
        message: "Someone liked your post",
        relatedId: postId,
        fromUserId: userId,
      });
    }
    
    return true;
  }
}

export async function getPostComments(postId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const comments = await db.select({
    id: postComments.id,
    postId: postComments.postId,
    userId: postComments.userId,
    content: postComments.content,
    createdAt: postComments.createdAt,
    userName: users.name,
  })
  .from(postComments)
  .leftJoin(users, eq(postComments.userId, users.id))
  .where(eq(postComments.postId, postId))
  .orderBy(desc(postComments.createdAt));
  
  return comments;
}

export async function createComment(data: InsertPostComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(postComments).values(data);
  
  // Get post author to send notification
  const post = await db.select().from(socialPosts).where(eq(socialPosts.id, data.postId)).limit(1);
  if (post.length > 0 && post[0].userId !== data.userId) {
    // Don't notify if user comments on their own post
    await createNotification({
      userId: post[0].userId,
      type: "comment",
      title: "New Comment",
      message: "Someone commented on your post",
      relatedId: data.postId,
      fromUserId: data.userId,
    });
  }
  
  return Number(result.insertId);
}

export async function deletePost(postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Delete associated likes and comments first
  await db.delete(postLikes).where(eq(postLikes.postId, postId));
  await db.delete(postComments).where(eq(postComments.postId, postId));
  // Then delete the post
  await db.delete(socialPosts).where(eq(socialPosts.id, postId));
}

export async function deleteComment(commentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(postComments).where(eq(postComments.id, commentId));
}

// Leaderboard
export async function getWeeklyLeaderboard(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return db.select({
    userId: readingSessions.userId,
    name: users.name,
    pagesRead: sql<number>`SUM(${readingSessions.endPage} - ${readingSessions.startPage})`,
  })
  .from(readingSessions)
  .leftJoin(users, eq(readingSessions.userId, users.id))
  .where(gte(readingSessions.createdAt, oneWeekAgo))
  .groupBy(readingSessions.userId, users.name)
  .orderBy(desc(sql`SUM(${readingSessions.endPage} - ${readingSessions.startPage})`))
  .limit(limit);
}

// User Follows
export async function followUser(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(userFollows).where(
    and(eq(userFollows.followerId, followerId), eq(userFollows.followingId, followingId))
  ).limit(1);
  
  if (existing.length > 0) {
    await db.delete(userFollows).where(and(eq(userFollows.followerId, followerId), eq(userFollows.followingId, followingId)));
    return false;
  } else {
    await db.insert(userFollows).values({ followerId, followingId });
    return true;
  }
}

export async function getFollowing(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userFollows).where(eq(userFollows.followerId, userId));
}


// Notification functions
export async function createNotification(data: {
  userId: number;
  type: "like" | "comment" | "follow" | "milestone";
  title: string;
  message: string;
  relatedId?: number;
  fromUserId?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const { notifications } = await import("../drizzle/schema");
  
  await db.insert(notifications).values(data);
}

export async function getNotifications(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  
  const { notifications, users } = await import("../drizzle/schema");
  const { desc, eq } = await import("drizzle-orm");
  
  const results = await db
    .select({
      notification: notifications,
      fromUser: users,
    })
    .from(notifications)
    .leftJoin(users, eq(notifications.fromUserId, users.id))
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
  
  return results;
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const { notifications } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");
  
  const results = await db
    .select()
    .from(notifications)
    .where(and(
      eq(notifications.userId, userId),
      eq(notifications.isRead, 0)
    ));
  
  return results.length;
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return;
  
  const { notifications } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  await db
    .update(notifications)
    .set({ isRead: 1 })
    .where(eq(notifications.id, notificationId));
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) return;
  
  const { notifications } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  await db
    .update(notifications)
    .set({ isRead: 1 })
    .where(eq(notifications.userId, userId));
}


export async function unfollowUser(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { userFollows } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");
  
  await db.delete(userFollows).where(
    and(eq(userFollows.followerId, followerId), eq(userFollows.followingId, followingId))
  );
}

export async function isFollowing(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) return false;
  
  const { userFollows } = await import("../drizzle/schema");
  const { eq, and } = await import("drizzle-orm");
  
  const result = await db.select().from(userFollows).where(
    and(eq(userFollows.followerId, followerId), eq(userFollows.followingId, followingId))
  ).limit(1);
  
  return result.length > 0;
}

export async function getFollowerCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const { userFollows } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  const results = await db.select().from(userFollows).where(eq(userFollows.followingId, userId));
  return results.length;
}

export async function getFollowingCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  
  const { userFollows } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  const results = await db.select().from(userFollows).where(eq(userFollows.followerId, userId));
  return results.length;
}


export async function updateUserSubscriptionTier(
  userId: number,
  tier: 'free' | 'premium' | 'elite'
) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({ subscriptionTier: tier }).where(eq(users.id, userId));
}

export async function updateUserProfile(
  userId: number,
  data: {
    name?: string;
    username?: string;
    avatar?: string;
  }
) {
  const db = await getDb();
  if (!db) return;

  const updateData: Record<string, any> = {};
  
  if (data.name !== undefined) {
    updateData.name = data.name;
  }
  if (data.username !== undefined) {
    updateData.username = data.username;
  }
  if (data.avatar !== undefined) {
    updateData.avatar = data.avatar;
  }

  await db.update(users).set(updateData).where(eq(users.id, userId));
}

export async function updateUserOnboarding(
  userId: number,
  data: {
    onboardingCompleted?: boolean;
    readingGoalPagesPerWeek?: number;
    favoriteGenres?: string;
    notificationsEnabled?: boolean;
  }
) {
  const db = await getDb();
  if (!db) return;

  const updateData: Record<string, any> = {};
  
  if (data.onboardingCompleted !== undefined) {
    updateData.onboardingCompleted = data.onboardingCompleted ? 1 : 0;
  }
  if (data.readingGoalPagesPerWeek !== undefined) {
    updateData.readingGoalPagesPerWeek = data.readingGoalPagesPerWeek;
  }
  if (data.favoriteGenres !== undefined) {
    updateData.favoriteGenres = data.favoriteGenres;
  }
  if (data.notificationsEnabled !== undefined) {
    updateData.notificationsEnabled = data.notificationsEnabled ? 1 : 0;
  }

  await db.update(users).set(updateData).where(eq(users.id, userId));
}


// ========== EMAIL VERIFICATION ==========

export async function setEmailVerificationToken(
  userId: number,
  token: string,
  expiresAt: Date
) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({
    emailVerificationToken: token,
    emailVerificationExpires: expiresAt,
  }).where(eq(users.id, userId));
}

export async function verifyEmail(token: string) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  // Find user with this token
  const result = await db.select().from(users)
    .where(eq(users.emailVerificationToken, token))
    .limit(1);

  if (result.length === 0) {
    return { success: false, error: "Invalid verification token" };
  }

  const user = result[0];

  // Check if token has expired
  if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
    return { success: false, error: "Verification token has expired" };
  }

  // Mark email as verified and clear token
  await db.update(users).set({
    emailVerified: 1,
    emailVerificationToken: null,
    emailVerificationExpires: null,
  }).where(eq(users.id, user.id));

  return { success: true, userId: user.id };
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

// ========== ADMIN FUNCTIONS ==========

export async function getAllUsers(limit: number = 100, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    username: users.username,
    avatar: users.avatar,
    role: users.role,
    subscriptionTier: users.subscriptionTier,
    subscriptionStatus: users.subscriptionStatus,
    emailVerified: users.emailVerified,
    onboardingCompleted: users.onboardingCompleted,
    createdAt: users.createdAt,
    lastSignedIn: users.lastSignedIn,
  })
  .from(users)
  .orderBy(desc(users.createdAt))
  .limit(limit)
  .offset(offset);
}

export async function getUserCount() {
  const db = await getDb();
  if (!db) return { total: 0, premium: 0, elite: 0, verified: 0 };

  const allUsers = await db.select().from(users);
  
  return {
    total: allUsers.length,
    premium: allUsers.filter(u => u.subscriptionTier === "premium").length,
    elite: allUsers.filter(u => u.subscriptionTier === "elite").length,
    verified: allUsers.filter(u => u.emailVerified === 1).length,
  };
}

export async function getEngagementMetrics() {
  const db = await getDb();
  if (!db) return {
    totalBooks: 0,
    totalSessions: 0,
    totalPagesRead: 0,
    activeUsersToday: 0,
    activeUsersWeek: 0,
  };

  const { books, readingSessions, userStats } = await import("../drizzle/schema");
  
  const allBooks = await db.select().from(books);
  const allSessions = await db.select().from(readingSessions);
  const allStats = await db.select().from(userStats);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const activeToday = await db.select().from(users)
    .where(gte(users.lastSignedIn, today));
  
  const activeWeek = await db.select().from(users)
    .where(gte(users.lastSignedIn, oneWeekAgo));

  const totalPagesRead = allStats.reduce((sum, s) => sum + (s.totalPagesRead || 0), 0);

  return {
    totalBooks: allBooks.length,
    totalSessions: allSessions.length,
    totalPagesRead,
    activeUsersToday: activeToday.length,
    activeUsersWeek: activeWeek.length,
  };
}

// ========== CURATED READING LISTS (Admin) ==========

import { mysqlTable, int, varchar, text, timestamp } from "drizzle-orm/mysql-core";

// Note: This table needs to be added to schema.ts for proper type support
// For now, we'll use raw SQL queries

export async function getCuratedLists() {
  const db = await getDb();
  if (!db) return [];

  // Return hardcoded lists for now - these match what's in reading-lists.tsx
  return [
    {
      id: "law-school-essentials",
      title: "Law School Essentials",
      description: "Must-reads for aspiring lawyers",
      bookCount: 12,
      coverEmoji: "⚖️",
      tier: "premium",
    },
    {
      id: "business-strategy",
      title: "Business Strategy",
      description: "Build your business acumen",
      bookCount: 15,
      coverEmoji: "📈",
      tier: "premium",
    },
    {
      id: "philosophy-classics",
      title: "Philosophy Classics",
      description: "Timeless wisdom from great thinkers",
      bookCount: 10,
      coverEmoji: "🏛️",
      tier: "premium",
    },
    {
      id: "productivity-mastery",
      title: "Productivity Mastery",
      description: "Optimize your performance",
      bookCount: 8,
      coverEmoji: "⚡",
      tier: "elite",
    },
    {
      id: "leadership-excellence",
      title: "Leadership Excellence",
      description: "Lead with confidence",
      bookCount: 11,
      coverEmoji: "👑",
      tier: "elite",
    },
  ];
}

export async function updateUserRole(userId: number, role: "user" | "admin") {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({ role }).where(eq(users.id, userId));
}

export async function deleteUser(userId: number) {
  const db = await getDb();
  if (!db) return;

  // Delete user's related data first
  const { books, readingSessions, notes, userStats, socialPosts, postLikes, postComments, userFollows, notifications } = await import("../drizzle/schema");
  
  await db.delete(readingSessions).where(eq(readingSessions.userId, userId));
  await db.delete(notes).where(eq(notes.userId, userId));
  await db.delete(books).where(eq(books.userId, userId));
  await db.delete(userStats).where(eq(userStats.userId, userId));
  await db.delete(socialPosts).where(eq(socialPosts.userId, userId));
  await db.delete(postLikes).where(eq(postLikes.userId, userId));
  await db.delete(postComments).where(eq(postComments.userId, userId));
  await db.delete(userFollows).where(eq(userFollows.followerId, userId));
  await db.delete(userFollows).where(eq(userFollows.followingId, userId));
  await db.delete(notifications).where(eq(notifications.userId, userId));
  
  // Finally delete the user
  await db.delete(users).where(eq(users.id, userId));
}


// ========== ACCOUNTABILITY MESSAGING ==========

export async function getAccountabilityMessages(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const { accountabilityMessages } = await import("../drizzle/schema");
  
  return db.select()
    .from(accountabilityMessages)
    .where(eq(accountabilityMessages.userId, userId))
    .orderBy(accountabilityMessages.createdAt);
}

export async function sendAccountabilityMessage(
  userId: number,
  senderType: "user" | "founder",
  content: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const { accountabilityMessages } = await import("../drizzle/schema");
  
  const result = await db.insert(accountabilityMessages).values({
    userId,
    senderType,
    content,
  });
  
  return result;
}

export async function getAllAccountabilityConversations() {
  const db = await getDb();
  if (!db) return [];

  const { accountabilityMessages } = await import("../drizzle/schema");
  
  // Get all messages grouped by user with user info
  const messages = await db.select({
    message: accountabilityMessages,
    user: {
      id: users.id,
      name: users.name,
      email: users.email,
      username: users.username,
      avatar: users.avatar,
      subscriptionTier: users.subscriptionTier,
    }
  })
  .from(accountabilityMessages)
  .leftJoin(users, eq(accountabilityMessages.userId, users.id))
  .orderBy(desc(accountabilityMessages.createdAt));
  
  // Group by user
  const conversations: Record<number, {
    user: typeof messages[0]["user"];
    messages: typeof messages[0]["message"][];
    lastMessage: typeof messages[0]["message"];
    unreadCount: number;
  }> = {};
  
  for (const row of messages) {
    const userId = row.message.userId;
    if (!conversations[userId]) {
      conversations[userId] = {
        user: row.user,
        messages: [],
        lastMessage: row.message,
        unreadCount: 0,
      };
    }
    conversations[userId].messages.push(row.message);
    if (row.message.senderType === "user" && !row.message.isRead) {
      conversations[userId].unreadCount++;
    }
  }
  
  return Object.values(conversations).sort((a, b) => 
    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );
}

export async function markMessagesAsRead(userId: number) {
  const db = await getDb();
  if (!db) return;

  const { accountabilityMessages } = await import("../drizzle/schema");
  const { and } = await import("drizzle-orm");
  
  await db.update(accountabilityMessages)
    .set({ isRead: 1 })
    .where(and(
      eq(accountabilityMessages.userId, userId),
      eq(accountabilityMessages.senderType, "user")
    ));
}


export async function updateUserSubscription(
  userId: number,
  data: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trialing';
    subscriptionTier?: 'free' | 'premium' | 'elite';
    subscriptionEndsAt?: Date;
  }
) {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set(data).where(eq(users.id, userId));
}
