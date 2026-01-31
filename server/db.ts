import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
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
export async function getSocialPosts(userId?: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select({ post: socialPosts, book: books, user: users })
    .from(socialPosts)
    .leftJoin(books, eq(socialPosts.bookId, books.id))
    .leftJoin(users, eq(socialPosts.userId, users.id))
    .orderBy(desc(socialPosts.createdAt))
    .limit(limit);
  if (userId) query = query.where(eq(socialPosts.userId, userId)) as any;
  return query;
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
    return true;
  }
}

export async function getPostComments(postId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(postComments).where(eq(postComments.postId, postId)).orderBy(desc(postComments.createdAt));
}

export async function createComment(data: InsertPostComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result: any = await db.insert(postComments).values(data);
  return Number(result.insertId);
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
