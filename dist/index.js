var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
var schema_exports = {};
__export(schema_exports, {
  accountabilityMessages: () => accountabilityMessages,
  books: () => books,
  buddyPairs: () => buddyPairs,
  notes: () => notes,
  notifications: () => notifications,
  postComments: () => postComments,
  postLikes: () => postLikes,
  readingSessions: () => readingSessions,
  socialPosts: () => socialPosts,
  userFollows: () => userFollows,
  userStats: () => userStats,
  users: () => users
});
import { int, mysqlEnum, mysqlTable, text, timestamp, tinyint, varchar } from "drizzle-orm/mysql-core";
var users, books, readingSessions, notes, userStats, socialPosts, postLikes, postComments, userFollows, notifications, buddyPairs, accountabilityMessages;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    users = mysqlTable("users", {
      /**
       * Surrogate primary key. Auto-incremented numeric value managed by the database.
       * Use this for relations between tables.
       */
      id: int("id").autoincrement().primaryKey(),
      /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      username: varchar("username", { length: 50 }),
      avatar: varchar("avatar", { length: 10 }),
      // Emoji avatar
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
      subscriptionTier: mysqlEnum("subscriptionTier", ["free", "premium", "elite"]).default("free").notNull(),
      stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
      stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
      subscriptionStatus: mysqlEnum("subscriptionStatus", ["active", "canceled", "past_due", "trialing"]),
      subscriptionEndsAt: timestamp("subscriptionEndsAt"),
      // Onboarding fields
      onboardingCompleted: tinyint("onboardingCompleted").default(0).notNull(),
      readingGoalPagesPerWeek: int("readingGoalPagesPerWeek"),
      favoriteGenres: text("favoriteGenres"),
      // JSON array of genres
      notificationsEnabled: tinyint("notificationsEnabled").default(1).notNull(),
      emailVerified: tinyint("emailVerified").default(0).notNull(),
      emailVerificationToken: varchar("emailVerificationToken", { length: 64 }),
      emailVerificationExpires: timestamp("emailVerificationExpires"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    books = mysqlTable("books", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      title: varchar("title", { length: 500 }).notNull(),
      author: varchar("author", { length: 255 }).notNull(),
      category: varchar("category", { length: 100 }).notNull(),
      totalPages: int("totalPages").notNull(),
      currentPage: int("currentPage").default(0).notNull(),
      coverUrl: text("coverUrl"),
      status: mysqlEnum("status", ["reading", "queue", "completed"]).default("queue").notNull(),
      rating: int("rating"),
      startedAt: timestamp("startedAt"),
      completedAt: timestamp("completedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    readingSessions = mysqlTable("reading_sessions", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      bookId: int("bookId").notNull(),
      startPage: int("startPage").notNull(),
      endPage: int("endPage").notNull(),
      durationMinutes: int("durationMinutes").notNull(),
      notes: text("notes"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    notes = mysqlTable("notes", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      bookId: int("bookId").notNull(),
      content: text("content").notNull(),
      pageNumber: int("pageNumber"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    userStats = mysqlTable("user_stats", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull().unique(),
      currentStreak: int("currentStreak").default(0).notNull(),
      longestStreak: int("longestStreak").default(0).notNull(),
      totalPagesRead: int("totalPagesRead").default(0).notNull(),
      totalMinutesRead: int("totalMinutesRead").default(0).notNull(),
      booksCompleted: int("booksCompleted").default(0).notNull(),
      dailyGoalMinutes: int("dailyGoalMinutes").default(60).notNull(),
      lastReadDate: timestamp("lastReadDate"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    socialPosts = mysqlTable("social_posts", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      content: text("content").notNull(),
      bookId: int("bookId"),
      rating: int("rating"),
      likes: int("likes").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
    });
    postLikes = mysqlTable("post_likes", {
      id: int("id").autoincrement().primaryKey(),
      postId: int("postId").notNull(),
      userId: int("userId").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    postComments = mysqlTable("post_comments", {
      id: int("id").autoincrement().primaryKey(),
      postId: int("postId").notNull(),
      userId: int("userId").notNull(),
      content: text("content").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    userFollows = mysqlTable("user_follows", {
      id: int("id").autoincrement().primaryKey(),
      followerId: int("followerId").notNull(),
      followingId: int("followingId").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    notifications = mysqlTable("notifications", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      // User who receives the notification
      type: mysqlEnum("type", ["like", "comment", "follow", "milestone"]).notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      message: text("message").notNull(),
      relatedId: int("relatedId"),
      // ID of related entity (post, comment, etc.)
      fromUserId: int("fromUserId"),
      // User who triggered the notification
      isRead: tinyint("isRead").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    buddyPairs = mysqlTable("buddy_pairs", {
      id: int("id").autoincrement().primaryKey(),
      user1Id: int("user1Id").notNull(),
      user2Id: int("user2Id").notNull(),
      status: mysqlEnum("status", ["pending", "matched", "inactive"]).default("pending").notNull(),
      requestedAt: timestamp("requestedAt").defaultNow().notNull(),
      matchedAt: timestamp("matchedAt"),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    accountabilityMessages = mysqlTable("accountability_messages", {
      id: int("id").autoincrement().primaryKey(),
      userId: int("userId").notNull(),
      // The Elite user
      senderType: mysqlEnum("senderType", ["user", "founder"]).notNull(),
      content: text("content").notNull(),
      isRead: tinyint("isRead").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
      forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
    };
  }
});

// server/db.ts
var db_exports = {};
__export(db_exports, {
  calculateUserStats: () => calculateUserStats,
  createBook: () => createBook,
  createComment: () => createComment,
  createNote: () => createNote,
  createNotification: () => createNotification,
  createReadingSession: () => createReadingSession,
  createSocialPost: () => createSocialPost,
  deleteBook: () => deleteBook,
  deleteComment: () => deleteComment,
  deleteNote: () => deleteNote,
  deletePost: () => deletePost,
  deleteUser: () => deleteUser,
  followUser: () => followUser,
  getAccountabilityMessages: () => getAccountabilityMessages,
  getAllAccountabilityConversations: () => getAllAccountabilityConversations,
  getAllUsers: () => getAllUsers,
  getBookById: () => getBookById,
  getBookNotes: () => getBookNotes,
  getBookSessions: () => getBookSessions,
  getCuratedLists: () => getCuratedLists,
  getDb: () => getDb,
  getDemoBooks: () => getDemoBooks,
  getEngagementMetrics: () => getEngagementMetrics,
  getFollowerCount: () => getFollowerCount,
  getFollowing: () => getFollowing,
  getFollowingCount: () => getFollowingCount,
  getNotifications: () => getNotifications,
  getPostComments: () => getPostComments,
  getSocialPosts: () => getSocialPosts,
  getUnreadNotificationCount: () => getUnreadNotificationCount,
  getUserBooks: () => getUserBooks,
  getUserByEmail: () => getUserByEmail,
  getUserByOpenId: () => getUserByOpenId,
  getUserCount: () => getUserCount,
  getUserSessions: () => getUserSessions,
  getUserStats: () => getUserStats,
  getWeeklyLeaderboard: () => getWeeklyLeaderboard,
  isFollowing: () => isFollowing,
  likePost: () => likePost,
  markAllNotificationsAsRead: () => markAllNotificationsAsRead,
  markMessagesAsRead: () => markMessagesAsRead,
  markNotificationAsRead: () => markNotificationAsRead,
  sendAccountabilityMessage: () => sendAccountabilityMessage,
  setEmailVerificationToken: () => setEmailVerificationToken,
  unfollowUser: () => unfollowUser,
  updateBook: () => updateBook,
  updateUserOnboarding: () => updateUserOnboarding,
  updateUserProfile: () => updateUserProfile,
  updateUserRole: () => updateUserRole,
  updateUserStats: () => updateUserStats,
  updateUserSubscription: () => updateUserSubscription,
  updateUserSubscriptionTier: () => updateUserSubscriptionTier,
  upsertUser: () => upsertUser,
  verifyEmail: () => verifyEmail
});
import { eq } from "drizzle-orm";
import { desc, and, sql, gte } from "drizzle-orm";
async function getDb() {
  const dsn = process.env.DATABASE_URL || process.env.DATABASE_DSN;
  if (_db && _currentDsn && dsn && _currentDsn !== dsn) {
    console.log("[Database] DSN changed, reinitializing connection");
    _db = null;
    _currentDsn = null;
  }
  if (!_db && dsn) {
    try {
      console.log("[Database] Connecting with DSN:", dsn.substring(0, 20) + "...");
      if (dsn.startsWith("postgresql://") || dsn.startsWith("postgres://")) {
        const { drizzle } = await import("drizzle-orm/postgres-js");
        const { default: postgres } = await import("postgres");
        const client = postgres(dsn);
        _db = drizzle(client);
        _currentDsn = dsn;
        console.log("[Database] Using PostgreSQL driver");
      } else {
        const { drizzle } = await import("drizzle-orm/mysql2");
        _db = drizzle(dsn);
        _currentDsn = dsn;
        console.log("[Database] Using MySQL driver");
      }
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
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserBooks(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(books).where(eq(books.userId, userId)).orderBy(desc(books.updatedAt));
}
async function getDemoBooks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(books).where(sql`${books.userId} <= 10`).orderBy(desc(books.updatedAt)).limit(20);
}
async function getBookById(bookId) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(books).where(eq(books.id, bookId)).limit(1);
  return result[0] || null;
}
async function createBook(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(books).values(data);
  const insertId = result.insertId ?? result[0]?.insertId ?? result;
  return Number(insertId);
}
async function updateBook(bookId, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(books).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(books.id, bookId));
}
async function deleteBook(bookId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(books).where(eq(books.id, bookId));
}
async function getBookSessions(bookId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(readingSessions).where(eq(readingSessions.bookId, bookId)).orderBy(desc(readingSessions.createdAt));
}
async function getUserSessions(userId, limit) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(readingSessions).where(eq(readingSessions.userId, userId)).orderBy(desc(readingSessions.createdAt));
  if (limit) query = query.limit(limit);
  return query;
}
async function createReadingSession(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(readingSessions).values(data);
  await db.update(books).set({ currentPage: data.endPage, updatedAt: /* @__PURE__ */ new Date() }).where(eq(books.id, data.bookId));
  return Number(result.insertId);
}
async function getBookNotes(bookId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notes).where(eq(notes.bookId, bookId)).orderBy(desc(notes.createdAt));
}
async function createNote(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(notes).values(data);
  return Number(result.insertId);
}
async function deleteNote(noteId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(notes).where(eq(notes.id, noteId));
}
async function getUserStats(userId) {
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
async function updateUserStats(userId, data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(userStats).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userStats.userId, userId));
}
async function calculateUserStats(userId) {
  const db = await getDb();
  if (!db) return null;
  const sessions = await getUserSessions(userId);
  const totalMinutesRead = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalPagesRead = sessions.reduce((sum, s) => sum + (s.endPage - s.startPage), 0);
  const userBooks = await getUserBooks(userId);
  const booksCompleted = userBooks.filter((b) => b.status === "completed").length;
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  let currentStreak = 0;
  let checkDate = new Date(today);
  for (let i = 0; i < 365; i++) {
    const dayStart = new Date(checkDate);
    const dayEnd = new Date(checkDate);
    dayEnd.setHours(23, 59, 59, 999);
    const daySessions = sessions.filter((s) => {
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
    lastReadDate: sessions[0]?.createdAt || null
  });
  return getUserStats(userId);
}
async function getSocialPosts(userId, limit = 20, followingOnly = false, currentUserId) {
  const db = await getDb();
  if (!db) return [];
  let postsResult = await db.select({ post: socialPosts, book: books, user: users }).from(socialPosts).leftJoin(books, eq(socialPosts.bookId, books.id)).leftJoin(users, eq(socialPosts.userId, users.id)).orderBy(desc(socialPosts.createdAt)).limit(limit * 3);
  if (userId) {
    postsResult = postsResult.filter((item) => item.post.userId === userId);
  }
  if (followingOnly && currentUserId) {
    const following = await db.select().from(userFollows).where(eq(userFollows.followerId, currentUserId));
    const followingIds = following.map((f) => f.followingId);
    postsResult = postsResult.filter((item) => followingIds.includes(item.post.userId));
  }
  postsResult = postsResult.slice(0, limit);
  if (userId) {
    return postsResult;
  }
  const postsWithComments = await Promise.all(
    postsResult.map(async (item) => {
      const commentCount = await db.select({ count: sql`COUNT(*)` }).from(postComments).where(eq(postComments.postId, item.post.id));
      return {
        ...item,
        comments: Number(commentCount[0]?.count || 0)
      };
    })
  );
  return postsWithComments;
}
async function createSocialPost(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(socialPosts).values(data);
  return Number(result.insertId);
}
async function likePost(postId, userId) {
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
    const post = await db.select().from(socialPosts).where(eq(socialPosts.id, postId)).limit(1);
    if (post.length > 0 && post[0].userId !== userId) {
      await createNotification({
        userId: post[0].userId,
        type: "like",
        title: "New Like",
        message: "Someone liked your post",
        relatedId: postId,
        fromUserId: userId
      });
    }
    return true;
  }
}
async function getPostComments(postId) {
  const db = await getDb();
  if (!db) return [];
  const comments = await db.select({
    id: postComments.id,
    postId: postComments.postId,
    userId: postComments.userId,
    content: postComments.content,
    createdAt: postComments.createdAt,
    userName: users.name
  }).from(postComments).leftJoin(users, eq(postComments.userId, users.id)).where(eq(postComments.postId, postId)).orderBy(desc(postComments.createdAt));
  return comments;
}
async function createComment(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(postComments).values(data);
  const post = await db.select().from(socialPosts).where(eq(socialPosts.id, data.postId)).limit(1);
  if (post.length > 0 && post[0].userId !== data.userId) {
    await createNotification({
      userId: post[0].userId,
      type: "comment",
      title: "New Comment",
      message: "Someone commented on your post",
      relatedId: data.postId,
      fromUserId: data.userId
    });
  }
  return Number(result.insertId);
}
async function deletePost(postId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(postLikes).where(eq(postLikes.postId, postId));
  await db.delete(postComments).where(eq(postComments.postId, postId));
  await db.delete(socialPosts).where(eq(socialPosts.id, postId));
}
async function deleteComment(commentId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(postComments).where(eq(postComments.id, commentId));
}
async function getWeeklyLeaderboard(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  const oneWeekAgo = /* @__PURE__ */ new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return db.select({
    userId: readingSessions.userId,
    name: users.name,
    pagesRead: sql`SUM(${readingSessions.endPage} - ${readingSessions.startPage})`
  }).from(readingSessions).leftJoin(users, eq(readingSessions.userId, users.id)).where(gte(readingSessions.createdAt, oneWeekAgo)).groupBy(readingSessions.userId, users.name).orderBy(desc(sql`SUM(${readingSessions.endPage} - ${readingSessions.startPage})`)).limit(limit);
}
async function followUser(followerId, followingId) {
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
async function getFollowing(userId) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userFollows).where(eq(userFollows.followerId, userId));
}
async function createNotification(data) {
  const db = await getDb();
  if (!db) return null;
  const { notifications: notifications2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  await db.insert(notifications2).values(data);
}
async function getNotifications(userId, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  const { notifications: notifications2, users: users2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const { desc: desc2, eq: eq2 } = await import("drizzle-orm");
  const results = await db.select({
    notification: notifications2,
    fromUser: users2
  }).from(notifications2).leftJoin(users2, eq2(notifications2.fromUserId, users2.id)).where(eq2(notifications2.userId, userId)).orderBy(desc2(notifications2.createdAt)).limit(limit);
  return results;
}
async function getUnreadNotificationCount(userId) {
  const db = await getDb();
  if (!db) return 0;
  const { notifications: notifications2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const { eq: eq2, and: and2 } = await import("drizzle-orm");
  const results = await db.select().from(notifications2).where(and2(
    eq2(notifications2.userId, userId),
    eq2(notifications2.isRead, 0)
  ));
  return results.length;
}
async function markNotificationAsRead(notificationId) {
  const db = await getDb();
  if (!db) return;
  const { notifications: notifications2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const { eq: eq2 } = await import("drizzle-orm");
  await db.update(notifications2).set({ isRead: 1 }).where(eq2(notifications2.id, notificationId));
}
async function markAllNotificationsAsRead(userId) {
  const db = await getDb();
  if (!db) return;
  const { notifications: notifications2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const { eq: eq2 } = await import("drizzle-orm");
  await db.update(notifications2).set({ isRead: 1 }).where(eq2(notifications2.userId, userId));
}
async function unfollowUser(followerId, followingId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { userFollows: userFollows2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const { eq: eq2, and: and2 } = await import("drizzle-orm");
  await db.delete(userFollows2).where(
    and2(eq2(userFollows2.followerId, followerId), eq2(userFollows2.followingId, followingId))
  );
}
async function isFollowing(followerId, followingId) {
  const db = await getDb();
  if (!db) return false;
  const { userFollows: userFollows2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const { eq: eq2, and: and2 } = await import("drizzle-orm");
  const result = await db.select().from(userFollows2).where(
    and2(eq2(userFollows2.followerId, followerId), eq2(userFollows2.followingId, followingId))
  ).limit(1);
  return result.length > 0;
}
async function getFollowerCount(userId) {
  const db = await getDb();
  if (!db) return 0;
  const { userFollows: userFollows2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const { eq: eq2 } = await import("drizzle-orm");
  const results = await db.select().from(userFollows2).where(eq2(userFollows2.followingId, userId));
  return results.length;
}
async function getFollowingCount(userId) {
  const db = await getDb();
  if (!db) return 0;
  const { userFollows: userFollows2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const { eq: eq2 } = await import("drizzle-orm");
  const results = await db.select().from(userFollows2).where(eq2(userFollows2.followerId, userId));
  return results.length;
}
async function updateUserSubscriptionTier(userId, tier) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ subscriptionTier: tier }).where(eq(users.id, userId));
}
async function updateUserProfile(userId, data) {
  const db = await getDb();
  if (!db) return;
  const updateData = {};
  if (data.name !== void 0) {
    updateData.name = data.name;
  }
  if (data.username !== void 0) {
    updateData.username = data.username;
  }
  if (data.avatar !== void 0) {
    updateData.avatar = data.avatar;
  }
  await db.update(users).set(updateData).where(eq(users.id, userId));
}
async function updateUserOnboarding(userId, data) {
  const db = await getDb();
  if (!db) return;
  const updateData = {};
  if (data.onboardingCompleted !== void 0) {
    updateData.onboardingCompleted = data.onboardingCompleted ? 1 : 0;
  }
  if (data.readingGoalPagesPerWeek !== void 0) {
    updateData.readingGoalPagesPerWeek = data.readingGoalPagesPerWeek;
  }
  if (data.favoriteGenres !== void 0) {
    updateData.favoriteGenres = data.favoriteGenres;
  }
  if (data.notificationsEnabled !== void 0) {
    updateData.notificationsEnabled = data.notificationsEnabled ? 1 : 0;
  }
  await db.update(users).set(updateData).where(eq(users.id, userId));
}
async function setEmailVerificationToken(userId, token, expiresAt) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({
    emailVerificationToken: token,
    emailVerificationExpires: expiresAt
  }).where(eq(users.id, userId));
}
async function verifyEmail(token) {
  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };
  const result = await db.select().from(users).where(eq(users.emailVerificationToken, token)).limit(1);
  if (result.length === 0) {
    return { success: false, error: "Invalid verification token" };
  }
  const user = result[0];
  if (user.emailVerificationExpires && /* @__PURE__ */ new Date() > user.emailVerificationExpires) {
    return { success: false, error: "Verification token has expired" };
  }
  await db.update(users).set({
    emailVerified: 1,
    emailVerificationToken: null,
    emailVerificationExpires: null
  }).where(eq(users.id, user.id));
  return { success: true, userId: user.id };
}
async function getUserByEmail(email) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : null;
}
async function getAllUsers(limit = 100, offset = 0) {
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
    lastSignedIn: users.lastSignedIn
  }).from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
}
async function getUserCount() {
  const db = await getDb();
  if (!db) return { total: 0, premium: 0, elite: 0, verified: 0 };
  const allUsers = await db.select().from(users);
  return {
    total: allUsers.length,
    premium: allUsers.filter((u) => u.subscriptionTier === "premium").length,
    elite: allUsers.filter((u) => u.subscriptionTier === "elite").length,
    verified: allUsers.filter((u) => u.emailVerified === 1).length
  };
}
async function getEngagementMetrics() {
  const db = await getDb();
  if (!db) return {
    totalBooks: 0,
    totalSessions: 0,
    totalPagesRead: 0,
    activeUsersToday: 0,
    activeUsersWeek: 0
  };
  const { books: books2, readingSessions: readingSessions2, userStats: userStats2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const allBooks = await db.select().from(books2);
  const allSessions = await db.select().from(readingSessions2);
  const allStats = await db.select().from(userStats2);
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const oneWeekAgo = /* @__PURE__ */ new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const activeToday = await db.select().from(users).where(gte(users.lastSignedIn, today));
  const activeWeek = await db.select().from(users).where(gte(users.lastSignedIn, oneWeekAgo));
  const totalPagesRead = allStats.reduce((sum, s) => sum + (s.totalPagesRead || 0), 0);
  return {
    totalBooks: allBooks.length,
    totalSessions: allSessions.length,
    totalPagesRead,
    activeUsersToday: activeToday.length,
    activeUsersWeek: activeWeek.length
  };
}
async function getCuratedLists() {
  const db = await getDb();
  if (!db) return [];
  return [
    {
      id: "law-school-essentials",
      title: "Law School Essentials",
      description: "Must-reads for aspiring lawyers",
      bookCount: 12,
      coverEmoji: "\u2696\uFE0F",
      tier: "premium"
    },
    {
      id: "business-strategy",
      title: "Business Strategy",
      description: "Build your business acumen",
      bookCount: 15,
      coverEmoji: "\u{1F4C8}",
      tier: "premium"
    },
    {
      id: "philosophy-classics",
      title: "Philosophy Classics",
      description: "Timeless wisdom from great thinkers",
      bookCount: 10,
      coverEmoji: "\u{1F3DB}\uFE0F",
      tier: "premium"
    },
    {
      id: "productivity-mastery",
      title: "Productivity Mastery",
      description: "Optimize your performance",
      bookCount: 8,
      coverEmoji: "\u26A1",
      tier: "elite"
    },
    {
      id: "leadership-excellence",
      title: "Leadership Excellence",
      description: "Lead with confidence",
      bookCount: 11,
      coverEmoji: "\u{1F451}",
      tier: "elite"
    }
  ];
}
async function updateUserRole(userId, role) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role }).where(eq(users.id, userId));
}
async function deleteUser(userId) {
  const db = await getDb();
  if (!db) return;
  const { books: books2, readingSessions: readingSessions2, notes: notes2, userStats: userStats2, socialPosts: socialPosts2, postLikes: postLikes2, postComments: postComments2, userFollows: userFollows2, notifications: notifications2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  await db.delete(readingSessions2).where(eq(readingSessions2.userId, userId));
  await db.delete(notes2).where(eq(notes2.userId, userId));
  await db.delete(books2).where(eq(books2.userId, userId));
  await db.delete(userStats2).where(eq(userStats2.userId, userId));
  await db.delete(socialPosts2).where(eq(socialPosts2.userId, userId));
  await db.delete(postLikes2).where(eq(postLikes2.userId, userId));
  await db.delete(postComments2).where(eq(postComments2.userId, userId));
  await db.delete(userFollows2).where(eq(userFollows2.followerId, userId));
  await db.delete(userFollows2).where(eq(userFollows2.followingId, userId));
  await db.delete(notifications2).where(eq(notifications2.userId, userId));
  await db.delete(users).where(eq(users.id, userId));
}
async function getAccountabilityMessages(userId) {
  const db = await getDb();
  if (!db) return [];
  const { accountabilityMessages: accountabilityMessages2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  return db.select().from(accountabilityMessages2).where(eq(accountabilityMessages2.userId, userId)).orderBy(accountabilityMessages2.createdAt);
}
async function sendAccountabilityMessage(userId, senderType, content) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { accountabilityMessages: accountabilityMessages2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const result = await db.insert(accountabilityMessages2).values({
    userId,
    senderType,
    content
  });
  return result;
}
async function getAllAccountabilityConversations() {
  const db = await getDb();
  if (!db) return [];
  const { accountabilityMessages: accountabilityMessages2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const messages = await db.select({
    message: accountabilityMessages2,
    user: {
      id: users.id,
      name: users.name,
      email: users.email,
      username: users.username,
      avatar: users.avatar,
      subscriptionTier: users.subscriptionTier
    }
  }).from(accountabilityMessages2).leftJoin(users, eq(accountabilityMessages2.userId, users.id)).orderBy(desc(accountabilityMessages2.createdAt));
  const conversations = {};
  for (const row of messages) {
    const userId = row.message.userId;
    if (!conversations[userId]) {
      conversations[userId] = {
        user: row.user,
        messages: [],
        lastMessage: row.message,
        unreadCount: 0
      };
    }
    conversations[userId].messages.push(row.message);
    if (row.message.senderType === "user" && !row.message.isRead) {
      conversations[userId].unreadCount++;
    }
  }
  return Object.values(conversations).sort(
    (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
  );
}
async function markMessagesAsRead(userId) {
  const db = await getDb();
  if (!db) return;
  const { accountabilityMessages: accountabilityMessages2 } = await Promise.resolve().then(() => (init_schema(), schema_exports));
  const { and: and2 } = await import("drizzle-orm");
  await db.update(accountabilityMessages2).set({ isRead: 1 }).where(and2(
    eq(accountabilityMessages2.userId, userId),
    eq(accountabilityMessages2.senderType, "user")
  ));
}
async function updateUserSubscription(userId, data) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, userId));
}
var _db, _currentDsn;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    init_schema();
    _db = null;
    _currentDsn = null;
  }
});

// server/lib/stripe.ts
var stripe_exports = {};
__export(stripe_exports, {
  cancelSubscription: () => cancelSubscription,
  createSubscription: () => createSubscription,
  getSubscription: () => getSubscription
});
import Stripe from "stripe";
function getStripe() {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SK;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }
    _stripe = new Stripe(key, { apiVersion: "2026-01-28.clover" });
  }
  return _stripe;
}
async function createSubscription(params) {
  const stripe = getStripe();
  const { paymentMethodId, email, tier, userId } = params;
  const priceId = PRICE_IDS[tier];
  if (!priceId) {
    throw new Error(`No price ID configured for tier: ${tier}`);
  }
  const customer = await stripe.customers.create({
    email,
    payment_method: paymentMethodId,
    invoice_settings: {
      default_payment_method: paymentMethodId
    },
    metadata: { userId: userId.toString(), tier }
  });
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_settings: {
      payment_method_types: ["card"],
      save_default_payment_method: "on_subscription"
    },
    expand: ["latest_invoice.payment_intent"],
    metadata: { userId: userId.toString(), tier }
  });
  let clientSecret = null;
  if (subscription.latest_invoice && typeof subscription.latest_invoice === "object") {
    const latestInvoice = subscription.latest_invoice;
    if (latestInvoice.payment_intent && typeof latestInvoice.payment_intent === "object") {
      clientSecret = latestInvoice.payment_intent.client_secret || null;
    }
  }
  return {
    subscriptionId: subscription.id,
    customerId: customer.id,
    clientSecret,
    status: subscription.status
  };
}
async function cancelSubscription(subscriptionId) {
  const stripe = getStripe();
  await stripe.subscriptions.cancel(subscriptionId);
}
async function getSubscription(subscriptionId) {
  const stripe = getStripe();
  return await stripe.subscriptions.retrieve(subscriptionId);
}
var _stripe, PRICE_IDS;
var init_stripe = __esm({
  "server/lib/stripe.ts"() {
    "use strict";
    _stripe = null;
    PRICE_IDS = {
      premium: process.env.STRIPE_PRICE_PREMIUM || "price_1SxAWd9pQe0qE44RKbuMQ4UU",
      elite: process.env.STRIPE_PRICE_ELITE || "price_1SxAXX9pQe0qE44RYLWsOQeD"
    };
  }
});

// server/webhooks/stripe.ts
var stripe_exports2 = {};
__export(stripe_exports2, {
  handleStripeWebhook: () => handleStripeWebhook
});
import Stripe2 from "stripe";
function getStripe2() {
  if (!_stripe2) {
    const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SK;
    if (!key) throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    _stripe2 = new Stripe2(key, { apiVersion: "2026-01-28.clover" });
  }
  return _stripe2;
}
async function handleStripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig) {
    console.error("[Stripe Webhook] No signature found");
    return res.status(400).send("No signature");
  }
  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).send("Webhook secret not configured");
  }
  let event;
  try {
    const stripe = getStripe2();
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log("[Stripe Webhook] Received event:", event.type);
  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error processing event:", error);
    res.status(500).send(`Webhook processing error: ${error.message}`);
  }
}
async function handleSubscriptionUpdate(subscription) {
  const userId = subscription.metadata.userId;
  const tier = subscription.metadata.tier;
  if (!userId) {
    console.error("[Stripe Webhook] No userId in subscription metadata");
    return;
  }
  const subscriptionStatus = mapStripeStatus(subscription.status);
  const subscriptionData = subscription;
  const currentPeriodEnd = subscriptionData.current_period_end;
  await updateUserSubscription(parseInt(userId), {
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus,
    subscriptionTier: tier,
    subscriptionEndsAt: currentPeriodEnd ? new Date(currentPeriodEnd * 1e3) : void 0
  });
  console.log(`[Stripe Webhook] Updated subscription for user ${userId}: ${subscription.status}`);
}
async function handleSubscriptionDeleted(subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) {
    console.error("[Stripe Webhook] No userId in subscription metadata");
    return;
  }
  await updateUserSubscription(parseInt(userId), {
    subscriptionStatus: "canceled",
    subscriptionTier: "free"
  });
  console.log(`[Stripe Webhook] Canceled subscription for user ${userId}`);
}
async function handlePaymentSucceeded(invoice) {
  const invoiceData = invoice;
  const subscriptionId = invoiceData.subscription;
  if (!subscriptionId) return;
  console.log(`[Stripe Webhook] Payment succeeded for subscription ${subscriptionId}`);
}
async function handlePaymentFailed(invoice) {
  const invoiceData = invoice;
  const subscriptionId = invoiceData.subscription;
  if (!subscriptionId) return;
  const stripe = getStripe2();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.userId;
  if (!userId) return;
  await updateUserSubscription(parseInt(userId), { subscriptionStatus: "past_due" });
  console.log(`[Stripe Webhook] Payment failed for user ${userId}, marked as past_due`);
}
function mapStripeStatus(status) {
  switch (status) {
    case "active":
      return "active";
    case "canceled":
      return "canceled";
    case "past_due":
      return "past_due";
    case "trialing":
      return "trialing";
    default:
      return "active";
  }
}
var _stripe2;
var init_stripe2 = __esm({
  "server/webhooks/stripe.ts"() {
    "use strict";
    init_db();
    _stripe2 = null;
  }
});

// server/_core/index.ts
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
var LOCAL_HOSTS = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1"]);
function isIpAddress(host) {
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getParentDomain(hostname) {
  if (LOCAL_HOSTS.has(hostname) || isIpAddress(hostname)) {
    return void 0;
  }
  const parts = hostname.split(".");
  if (parts.length < 3) {
    return void 0;
  }
  return "." + parts.slice(-2).join(".");
}
function getSessionCookieOptions(req) {
  const hostname = req.hostname;
  const domain = getParentDomain(hostname);
  return {
    domain,
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(EXCHANGE_TOKEN_PATH, payload);
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(GET_USER_INFO_PATH, {
      accessToken: token.accessToken
    });
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(platforms.filter((p) => typeof p === "string"));
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice("Bearer ".length).trim();
    }
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = token || cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
async function syncUser(userInfo) {
  if (!userInfo.openId) {
    throw new Error("openId missing from user info");
  }
  const lastSignedIn = /* @__PURE__ */ new Date();
  await upsertUser({
    openId: userInfo.openId,
    name: userInfo.name || null,
    email: userInfo.email ?? null,
    loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
    lastSignedIn
  });
  const saved = await getUserByOpenId(userInfo.openId);
  return saved ?? {
    openId: userInfo.openId,
    name: userInfo.name,
    email: userInfo.email,
    loginMethod: userInfo.loginMethod ?? null,
    lastSignedIn
  };
}
function buildUserResponse(user) {
  return {
    id: user?.id ?? null,
    openId: user?.openId ?? null,
    name: user?.name ?? null,
    email: user?.email ?? null,
    loginMethod: user?.loginMethod ?? null,
    lastSignedIn: (user?.lastSignedIn ?? /* @__PURE__ */ new Date()).toISOString()
  };
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      const frontendUrl = process.env.EXPO_WEB_PREVIEW_URL || process.env.EXPO_PACKAGER_PROXY_URL || "http://localhost:8081";
      res.redirect(302, frontendUrl);
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
  app.get("/api/oauth/mobile", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      const user = await syncUser(userInfo);
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({
        app_session_id: sessionToken,
        user: buildUserResponse(user)
      });
    } catch (error) {
      console.error("[OAuth] Mobile exchange failed", error);
      res.status(500).json({ error: "OAuth mobile exchange failed" });
    }
  });
  app.post("/api/auth/logout", (req, res) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });
  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      res.json({ user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/me failed:", error);
      res.status(401).json({ error: "Not authenticated", user: null });
    }
  });
  app.post("/api/auth/session", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
        res.status(400).json({ error: "Bearer token required" });
        return;
      }
      const token = authHeader.slice("Bearer ".length).trim();
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: buildUserResponse(user) });
    } catch (error) {
      console.error("[Auth] /api/auth/session failed:", error);
      res.status(401).json({ error: "Invalid token" });
    }
  });
}

// server/routers.ts
import { z as z2 } from "zod";

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
init_env();
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL("webdevtoken.v1.WebDevService/SendNotification", normalizedBase).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
init_db();

// server/lib/open-library.ts
async function searchBooks(query, maxResults = 10) {
  if (!query || query.trim().length === 0) {
    return [];
  }
  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://openlibrary.org/search.json?q=${encodedQuery}&limit=${maxResults}`;
    console.log("[OpenLibrary] Searching:", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`[OpenLibrary] API error: ${response.status} ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    if (!data.docs || data.docs.length === 0) {
      console.log("[OpenLibrary] No results found");
      return [];
    }
    console.log(`[OpenLibrary] Found ${data.docs.length} results`);
    return data.docs.map((item) => {
      const coverUrl = item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` : void 0;
      return {
        id: item.key,
        title: item.title || "Unknown Title",
        author: item.author_name?.join(", ") || "Unknown Author",
        totalPages: item.number_of_pages_median || 250,
        // Default to 250 if not available
        category: item.subject?.[0] || "General",
        coverUrl,
        description: void 0
        // Open Library search doesn't include descriptions
      };
    });
  } catch (error) {
    console.error("[OpenLibrary] Search failed:", error);
    return [];
  }
}

// server/lib/email-verification.ts
import crypto from "crypto";
function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}
function getTokenExpiration() {
  const expiration = /* @__PURE__ */ new Date();
  expiration.setHours(expiration.getHours() + 24);
  return expiration;
}

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // IvyReader API Routes
  books: router({
    list: protectedProcedure.query(({ ctx }) => getUserBooks(ctx.user.id)),
    // Get demo books for users with no books (public for social proof)
    demo: publicProcedure.query(() => getDemoBooks()),
    // Search books using Open Library API
    search: publicProcedure.input(z2.object({
      query: z2.string().min(1),
      maxResults: z2.number().int().positive().max(40).default(10)
    })).query(({ input }) => searchBooks(input.query, input.maxResults)),
    get: protectedProcedure.input(z2.object({ id: z2.number() })).query(({ input }) => getBookById(input.id)),
    create: protectedProcedure.input(z2.object({
      title: z2.string().min(1).max(500),
      author: z2.string().min(1).max(255),
      category: z2.string().min(1).max(100),
      totalPages: z2.number().int().positive(),
      coverUrl: z2.string().optional(),
      status: z2.enum(["reading", "queue", "completed"]).default("queue")
    })).mutation(
      ({ ctx, input }) => createBook({ ...input, userId: ctx.user.id })
    ),
    update: protectedProcedure.input(z2.object({
      id: z2.number(),
      title: z2.string().min(1).max(500).optional(),
      author: z2.string().min(1).max(255).optional(),
      category: z2.string().min(1).max(100).optional(),
      totalPages: z2.number().int().positive().optional(),
      coverUrl: z2.string().nullable().optional(),
      currentPage: z2.number().int().optional(),
      status: z2.enum(["reading", "queue", "completed"]).optional(),
      rating: z2.number().int().min(1).max(5).optional()
    })).mutation(({ input }) => {
      const { id, ...data } = input;
      return updateBook(id, data);
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteBook(input.id))
  }),
  sessions: router({
    listByBook: protectedProcedure.input(z2.object({ bookId: z2.number() })).query(({ input }) => getBookSessions(input.bookId)),
    listByUser: protectedProcedure.input(z2.object({ limit: z2.number().optional() })).query(({ ctx, input }) => getUserSessions(ctx.user.id, input.limit)),
    create: protectedProcedure.input(z2.object({
      bookId: z2.number(),
      startPage: z2.number().int(),
      endPage: z2.number().int(),
      durationMinutes: z2.number().int().positive(),
      notes: z2.string().optional()
    })).mutation(async ({ ctx, input }) => {
      const sessionId = await createReadingSession({ ...input, userId: ctx.user.id });
      await calculateUserStats(ctx.user.id);
      return sessionId;
    })
  }),
  notes: router({
    listByBook: protectedProcedure.input(z2.object({ bookId: z2.number() })).query(({ input }) => getBookNotes(input.bookId)),
    create: protectedProcedure.input(z2.object({
      bookId: z2.number(),
      content: z2.string().min(1),
      pageNumber: z2.number().int().optional()
    })).mutation(
      ({ ctx, input }) => createNote({ ...input, userId: ctx.user.id })
    ),
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteNote(input.id))
  }),
  stats: router({
    get: protectedProcedure.query(({ ctx }) => getUserStats(ctx.user.id)),
    update: protectedProcedure.input(z2.object({
      dailyGoalMinutes: z2.number().int().positive().optional()
    })).mutation(({ ctx, input }) => updateUserStats(ctx.user.id, input)),
    calculate: protectedProcedure.mutation(({ ctx }) => calculateUserStats(ctx.user.id))
  }),
  social: router({
    posts: protectedProcedure.input(z2.object({
      limit: z2.number().default(20),
      followingOnly: z2.boolean().default(false)
    })).query(
      ({ ctx, input }) => getSocialPosts(void 0, input.limit, input.followingOnly, ctx.user.id)
    ),
    createPost: protectedProcedure.input(z2.object({
      content: z2.string().min(1),
      bookId: z2.number().optional(),
      rating: z2.number().int().min(1).max(5).optional()
    })).mutation(
      ({ ctx, input }) => createSocialPost({ ...input, userId: ctx.user.id })
    ),
    likePost: protectedProcedure.input(z2.object({ postId: z2.number() })).mutation(({ ctx, input }) => likePost(input.postId, ctx.user.id)),
    comments: protectedProcedure.input(z2.object({ postId: z2.number() })).query(({ input }) => getPostComments(input.postId)),
    createComment: protectedProcedure.input(z2.object({
      postId: z2.number(),
      content: z2.string().min(1)
    })).mutation(
      ({ ctx, input }) => createComment({ ...input, userId: ctx.user.id })
    ),
    deletePost: protectedProcedure.input(z2.object({ postId: z2.number() })).mutation(({ input }) => deletePost(input.postId)),
    deleteComment: protectedProcedure.input(z2.object({ commentId: z2.number() })).mutation(({ input }) => deleteComment(input.commentId)),
    leaderboard: publicProcedure.input(z2.object({ limit: z2.number().default(10) })).query(({ input }) => getWeeklyLeaderboard(input.limit)),
    followUser: protectedProcedure.input(z2.object({ userId: z2.number() })).mutation(({ ctx, input }) => followUser(ctx.user.id, input.userId)),
    unfollowUser: protectedProcedure.input(z2.object({ userId: z2.number() })).mutation(({ ctx, input }) => unfollowUser(ctx.user.id, input.userId)),
    isFollowing: protectedProcedure.input(z2.object({ userId: z2.number() })).query(({ ctx, input }) => isFollowing(ctx.user.id, input.userId)),
    getFollowerCount: protectedProcedure.input(z2.object({ userId: z2.number() })).query(({ input }) => getFollowerCount(input.userId)),
    getFollowingCount: protectedProcedure.input(z2.object({ userId: z2.number() })).query(({ input }) => getFollowingCount(input.userId)),
    following: protectedProcedure.query(({ ctx }) => getFollowing(ctx.user.id))
  }),
  user: router({
    // Email verification
    sendVerificationEmail: protectedProcedure.input(z2.object({ email: z2.string().email() })).mutation(async ({ ctx, input }) => {
      const token = generateVerificationToken();
      const expires = getTokenExpiration();
      await setEmailVerificationToken(ctx.user.id, token, expires);
      const verificationUrl = `${process.env.APP_URL || "https://ivyreader.app"}/verify-email?token=${token}`;
      return { success: true, verificationUrl };
    }),
    verifyEmail: publicProcedure.input(z2.object({ token: z2.string() })).mutation(async ({ input }) => {
      return verifyEmail(input.token);
    }),
    updateProfile: protectedProcedure.input(z2.object({
      name: z2.string().min(1).max(100).optional(),
      username: z2.string().min(1).max(50).optional(),
      avatar: z2.string().max(10).optional()
    })).mutation(({ ctx, input }) => updateUserProfile(ctx.user.id, input)),
    updateSubscriptionTier: protectedProcedure.input(z2.object({
      subscriptionTier: z2.enum(["free", "premium", "elite"])
    })).mutation(({ ctx, input }) => updateUserSubscriptionTier(ctx.user.id, input.subscriptionTier)),
    updateOnboarding: protectedProcedure.input(z2.object({
      onboardingCompleted: z2.boolean().optional(),
      readingGoalPagesPerWeek: z2.number().int().positive().optional(),
      favoriteGenres: z2.string().optional(),
      notificationsEnabled: z2.boolean().optional()
    })).mutation(({ ctx, input }) => updateUserOnboarding(ctx.user.id, input))
  }),
  // Admin routes (require admin role)
  admin: router({
    // Get all users
    users: protectedProcedure.input(z2.object({
      limit: z2.number().default(100),
      offset: z2.number().default(0)
    })).query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      return getAllUsers(input.limit, input.offset);
    }),
    // Get user counts by tier
    userCounts: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      return getUserCount();
    }),
    // Get engagement metrics
    metrics: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      return getEngagementMetrics();
    }),
    // Get curated lists
    curatedLists: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      return getCuratedLists();
    }),
    // Update user role
    updateUserRole: protectedProcedure.input(z2.object({
      userId: z2.number(),
      role: z2.enum(["user", "admin"])
    })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      await updateUserRole(input.userId, input.role);
      return { success: true };
    }),
    // Delete user
    deleteUser: protectedProcedure.input(z2.object({ userId: z2.number() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      await deleteUser(input.userId);
      return { success: true };
    })
  }),
  // Public admin API for standalone dashboard (uses secret key auth)
  adminPublic: router({
    // Get all data for admin dashboard
    dashboard: publicProcedure.input(z2.object({ secretKey: z2.string() })).query(async ({ input }) => {
      const adminSecret = process.env.ADMIN_SECRET || "ivyreader-admin-2026";
      if (input.secretKey !== adminSecret) {
        throw new Error("Unauthorized: Invalid admin key");
      }
      const [userCounts, metrics, users2] = await Promise.all([
        getUserCount(),
        getEngagementMetrics(),
        getAllUsers(100, 0)
      ]);
      return {
        userCounts,
        metrics,
        users: users2
      };
    }),
    // Update user tier
    updateUserTier: publicProcedure.input(z2.object({
      secretKey: z2.string(),
      userId: z2.number(),
      tier: z2.enum(["free", "premium", "elite"])
    })).mutation(async ({ input }) => {
      const adminSecret = process.env.ADMIN_SECRET || "ivyreader-admin-2026";
      if (input.secretKey !== adminSecret) {
        throw new Error("Unauthorized: Invalid admin key");
      }
      await updateUserSubscriptionTier(input.userId, input.tier);
      return { success: true };
    }),
    // Delete user
    deleteUser: publicProcedure.input(z2.object({
      secretKey: z2.string(),
      userId: z2.number()
    })).mutation(async ({ input }) => {
      const adminSecret = process.env.ADMIN_SECRET || "ivyreader-admin-2026";
      if (input.secretKey !== adminSecret) {
        throw new Error("Unauthorized: Invalid admin key");
      }
      await deleteUser(input.userId);
      return { success: true };
    }),
    // Send verification email (stores token, actual email sending handled separately)
    sendVerificationEmail: publicProcedure.input(z2.object({
      secretKey: z2.string(),
      userId: z2.number()
    })).mutation(async ({ input }) => {
      const adminSecret = process.env.ADMIN_SECRET || "ivyreader-admin-2026";
      if (input.secretKey !== adminSecret) {
        throw new Error("Unauthorized: Invalid admin key");
      }
      const token = generateVerificationToken();
      const expiresAt = getTokenExpiration();
      await setEmailVerificationToken(input.userId, token, expiresAt);
      return { success: true, token };
    })
  }),
  notifications: router({
    list: protectedProcedure.input(z2.object({ limit: z2.number().default(20) })).query(({ ctx, input }) => getNotifications(ctx.user.id, input.limit)),
    unreadCount: protectedProcedure.query(({ ctx }) => getUnreadNotificationCount(ctx.user.id)),
    markAsRead: protectedProcedure.input(z2.object({ notificationId: z2.number() })).mutation(({ input }) => markNotificationAsRead(input.notificationId)),
    markAllAsRead: protectedProcedure.mutation(({ ctx }) => markAllNotificationsAsRead(ctx.user.id))
  }),
  // Accountability messaging (Elite feature - founder chat)
  accountability: router({
    // Get messages for current user
    getMessages: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.subscriptionTier !== "elite") {
        throw new Error("Elite subscription required");
      }
      return getAccountabilityMessages(ctx.user.id);
    }),
    // Send a message to founder
    sendMessage: protectedProcedure.input(z2.object({ content: z2.string().min(1).max(2e3) })).mutation(async ({ ctx, input }) => {
      if (ctx.user.subscriptionTier !== "elite") {
        throw new Error("Elite subscription required");
      }
      await sendAccountabilityMessage(ctx.user.id, "user", input.content);
      return { success: true };
    })
  }),
  // Public admin API for accountability messaging
  adminAccountability: router({
    // Get all conversations for admin dashboard
    getConversations: publicProcedure.input(z2.object({ secretKey: z2.string() })).query(async ({ input }) => {
      const adminSecret = process.env.ADMIN_SECRET || "ivyreader-admin-2026";
      if (input.secretKey !== adminSecret) {
        throw new Error("Unauthorized: Invalid admin key");
      }
      return getAllAccountabilityConversations();
    }),
    // Send a founder response
    sendResponse: publicProcedure.input(z2.object({
      secretKey: z2.string(),
      userId: z2.number(),
      content: z2.string().min(1).max(2e3)
    })).mutation(async ({ input }) => {
      const adminSecret = process.env.ADMIN_SECRET || "ivyreader-admin-2026";
      if (input.secretKey !== adminSecret) {
        throw new Error("Unauthorized: Invalid admin key");
      }
      await sendAccountabilityMessage(input.userId, "founder", input.content);
      return { success: true };
    }),
    // Mark messages as read
    markAsRead: publicProcedure.input(z2.object({
      secretKey: z2.string(),
      userId: z2.number()
    })).mutation(async ({ input }) => {
      const adminSecret = process.env.ADMIN_SECRET || "ivyreader-admin-2026";
      if (input.secretKey !== adminSecret) {
        throw new Error("Unauthorized: Invalid admin key");
      }
      await markMessagesAsRead(input.userId);
      return { success: true };
    })
  }),
  // Stripe subscription management
  subscriptions: router({
    // Create subscription
    create: publicProcedure.input(z2.object({
      paymentMethodId: z2.string(),
      email: z2.string().email(),
      tier: z2.enum(["premium", "elite"])
    })).mutation(async ({ input }) => {
      const { paymentMethodId, email, tier } = input;
      let user = await getUserByEmail(email);
      if (!user) {
        const tempOpenId = `pending_${Buffer.from(email).toString("base64").replace(/=/g, "").substring(0, 50)}`;
        await upsertUser({
          openId: tempOpenId,
          email,
          name: email.split("@")[0],
          // Use email prefix as temporary name
          subscriptionTier: tier,
          emailVerified: 0,
          onboardingCompleted: 0
        });
        user = await getUserByEmail(email);
        if (!user) {
          throw new Error("Failed to create user account");
        }
      }
      const { createSubscription: createSubscription2 } = await Promise.resolve().then(() => (init_stripe(), stripe_exports));
      const result = await createSubscription2({
        paymentMethodId,
        email,
        tier,
        userId: user.id
      });
      const subscriptionStatus = result.status === "active" || result.status === "trialing" ? result.status : "active";
      await updateUserSubscription(user.id, {
        stripeCustomerId: result.customerId,
        stripeSubscriptionId: result.subscriptionId,
        subscriptionStatus,
        subscriptionTier: tier
      });
      return {
        success: true,
        subscriptionId: result.subscriptionId,
        clientSecret: result.clientSecret,
        status: result.status,
        userId: user.id
      };
    }),
    // Cancel subscription
    cancel: protectedProcedure.mutation(async ({ ctx }) => {
      if (!ctx.user.stripeSubscriptionId) {
        throw new Error("No active subscription found");
      }
      const { cancelSubscription: cancelSubscription2 } = await Promise.resolve().then(() => (init_stripe(), stripe_exports));
      await cancelSubscription2(ctx.user.stripeSubscriptionId);
      await updateUserSubscription(ctx.user.id, {
        subscriptionStatus: "canceled"
      });
      return { success: true };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express();
  const server = createServer(app);
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }
    next();
  });
  app.post(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const { handleStripeWebhook: handleStripeWebhook2 } = await Promise.resolve().then(() => (init_stripe2(), stripe_exports2));
      return handleStripeWebhook2(req, res);
    }
  );
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerOAuthRoutes(app);
  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, timestamp: Date.now() });
  });
  app.post("/api/migrate", async (req, res) => {
    try {
      const dsn = process.env.DATABASE_URL;
      if (!dsn) {
        return res.status(500).json({ error: "DATABASE_URL not configured" });
      }
      const { default: postgres } = await import("postgres");
      const client = postgres(dsn);
      await client`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          "openId" VARCHAR(64) UNIQUE,
          name TEXT,
          username VARCHAR(50),
          avatar VARCHAR(10),
          email VARCHAR(320),
          "loginMethod" VARCHAR(64),
          role VARCHAR(20) DEFAULT 'user' NOT NULL,
          "subscriptionTier" VARCHAR(20) DEFAULT 'free' NOT NULL,
          "stripeCustomerId" VARCHAR(255),
          "stripeSubscriptionId" VARCHAR(255),
          "subscriptionStatus" VARCHAR(20),
          "subscriptionEndsAt" TIMESTAMP,
          "onboardingCompleted" SMALLINT DEFAULT 0 NOT NULL,
          "readingGoalPagesPerWeek" INTEGER,
          "favoriteGenres" TEXT,
          "notificationsEnabled" SMALLINT DEFAULT 1 NOT NULL,
          "emailVerified" SMALLINT DEFAULT 0 NOT NULL,
          "emailVerificationToken" VARCHAR(255),
          "emailVerificationExpires" TIMESTAMP,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "lastSignedIn" TIMESTAMP
        )
      `;
      await client.end();
      res.json({ success: true, message: "Database tables created successfully" });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  app.post("/api/subscriptions/create", async (req, res) => {
    try {
      const { paymentMethodId, email, tier } = req.body;
      const { getUserByEmail: getUserByEmail2, upsertUser: upsertUser2, updateUserSubscription: updateUserSubscription2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      let user = await getUserByEmail2(email);
      if (!user) {
        const tempOpenId = `pending_${Buffer.from(email).toString("base64").replace(/=/g, "").substring(0, 50)}`;
        await upsertUser2({
          openId: tempOpenId,
          email,
          name: email.split("@")[0],
          subscriptionTier: tier,
          emailVerified: 0,
          onboardingCompleted: 0
        });
        user = await getUserByEmail2(email);
        if (!user) throw new Error("Failed to create user");
      }
      const { createSubscription: createSubscription2 } = await Promise.resolve().then(() => (init_stripe(), stripe_exports));
      const result = await createSubscription2({ paymentMethodId, email, tier, userId: user.id });
      const status = result.status === "active" || result.status === "trialing" ? result.status : "active";
      await updateUserSubscription2(user.id, {
        stripeCustomerId: result.customerId,
        stripeSubscriptionId: result.subscriptionId,
        subscriptionStatus: status,
        subscriptionTier: tier
      });
      res.json({ success: true, subscriptionId: result.subscriptionId, userId: user.id });
    } catch (error) {
      console.error("[Subscription] Error:", error);
      res.status(500).json({ error: error.message || "Subscription creation failed" });
    }
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`[api] server listening on port ${port}`);
  });
}
startServer().catch(console.error);
