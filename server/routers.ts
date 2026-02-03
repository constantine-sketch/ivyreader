import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { searchBooks } from "./lib/open-library";

import { generateVerificationToken, getTokenExpiration } from "./lib/email-verification";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // IvyReader API Routes
  books: router({
    list: protectedProcedure.query(({ ctx }) => db.getUserBooks(ctx.user.id)),
    
    // Get demo books for users with no books (public for social proof)
    demo: publicProcedure.query(() => db.getDemoBooks()),
    
    // Search books using Open Library API
    search: publicProcedure
      .input(z.object({ 
        query: z.string().min(1),
        maxResults: z.number().int().positive().max(40).default(10)
      }))
      .query(({ input }) => searchBooks(input.query, input.maxResults)),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getBookById(input.id)),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(500),
        author: z.string().min(1).max(255),
        category: z.string().min(1).max(100),
        totalPages: z.number().int().positive(),
        coverUrl: z.string().optional(),
        status: z.enum(["reading", "queue", "completed"]).default("queue"),
      }))
      .mutation(({ ctx, input }) => 
        db.createBook({ ...input, userId: ctx.user.id })
      ),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(500).optional(),
        author: z.string().min(1).max(255).optional(),
        category: z.string().min(1).max(100).optional(),
        totalPages: z.number().int().positive().optional(),
        coverUrl: z.string().nullable().optional(),
        currentPage: z.number().int().optional(),
        status: z.enum(["reading", "queue", "completed"]).optional(),
        rating: z.number().int().min(1).max(5).optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateBook(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteBook(input.id)),
  }),
  
  sessions: router({
    listByBook: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .query(({ input }) => db.getBookSessions(input.bookId)),
    
    listByUser: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(({ ctx, input }) => db.getUserSessions(ctx.user.id, input.limit)),
    
    create: protectedProcedure
      .input(z.object({
        bookId: z.number(),
        startPage: z.number().int(),
        endPage: z.number().int(),
        durationMinutes: z.number().int().positive(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const sessionId = await db.createReadingSession({ ...input, userId: ctx.user.id });
        // Recalculate user stats after session
        await db.calculateUserStats(ctx.user.id);
        return sessionId;
      }),
  }),
  
  notes: router({
    listByBook: protectedProcedure
      .input(z.object({ bookId: z.number() }))
      .query(({ input }) => db.getBookNotes(input.bookId)),
    
    create: protectedProcedure
      .input(z.object({
        bookId: z.number(),
        content: z.string().min(1),
        pageNumber: z.number().int().optional(),
      }))
      .mutation(({ ctx, input }) => 
        db.createNote({ ...input, userId: ctx.user.id })
      ),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteNote(input.id)),
  }),
  
  stats: router({
    get: protectedProcedure.query(({ ctx }) => db.getUserStats(ctx.user.id)),
    
    update: protectedProcedure
      .input(z.object({
        dailyGoalMinutes: z.number().int().positive().optional(),
      }))
      .mutation(({ ctx, input }) => db.updateUserStats(ctx.user.id, input)),
    
    calculate: protectedProcedure.mutation(({ ctx }) => db.calculateUserStats(ctx.user.id)),
  }),
  
  social: router({
    posts: protectedProcedure
      .input(z.object({ 
        limit: z.number().default(20),
        followingOnly: z.boolean().default(false)
      }))
      .query(({ ctx, input }) => 
        db.getSocialPosts(undefined, input.limit, input.followingOnly, ctx.user.id)
      ),
    
    createPost: protectedProcedure
      .input(z.object({
        content: z.string().min(1),
        bookId: z.number().optional(),
        rating: z.number().int().min(1).max(5).optional(),
      }))
      .mutation(({ ctx, input }) => 
        db.createSocialPost({ ...input, userId: ctx.user.id })
      ),
    
    likePost: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(({ ctx, input }) => db.likePost(input.postId, ctx.user.id)),
    
    comments: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .query(({ input }) => db.getPostComments(input.postId)),
    
    createComment: protectedProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(({ ctx, input }) => 
        db.createComment({ ...input, userId: ctx.user.id })
      ),
    
    deletePost: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(({ input }) => db.deletePost(input.postId)),
    
    deleteComment: protectedProcedure
      .input(z.object({ commentId: z.number() }))
      .mutation(({ input }) => db.deleteComment(input.commentId)),
    
    leaderboard: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(({ input }) => db.getWeeklyLeaderboard(input.limit)),
    
    followUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(({ ctx, input }) => db.followUser(ctx.user.id, input.userId)),
    
    unfollowUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(({ ctx, input }) => db.unfollowUser(ctx.user.id, input.userId)),
    
    isFollowing: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ ctx, input }) => db.isFollowing(ctx.user.id, input.userId)),
    
    getFollowerCount: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ input }) => db.getFollowerCount(input.userId)),
    
    getFollowingCount: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ input }) => db.getFollowingCount(input.userId)),
    
    following: protectedProcedure.query(({ ctx }) => db.getFollowing(ctx.user.id)),
  }),
  
  user: router({
    // Email verification
    sendVerificationEmail: protectedProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        const token = generateVerificationToken();
        const expires = getTokenExpiration();
        
        // Update user email and set verification token
        await db.setEmailVerificationToken(ctx.user.id, token, expires);
        
        // In production, send actual email here
        // For now, return the verification URL for testing
        const verificationUrl = `${process.env.APP_URL || 'https://ivyreader.app'}/verify-email?token=${token}`;
        
        return { success: true, verificationUrl };
      }),
    
    verifyEmail: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        return db.verifyEmail(input.token);
      }),
    
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(100).optional(),
        username: z.string().min(1).max(50).optional(),
        avatar: z.string().max(10).optional(),
      }))
      .mutation(({ ctx, input }) => db.updateUserProfile(ctx.user.id, input)),
    
    updateSubscriptionTier: protectedProcedure
      .input(z.object({
        subscriptionTier: z.enum(["free", "premium", "elite"]),
      }))
      .mutation(({ ctx, input }) => db.updateUserSubscriptionTier(ctx.user.id, input.subscriptionTier)),
    
    updateOnboarding: protectedProcedure
      .input(z.object({
        onboardingCompleted: z.boolean().optional(),
        readingGoalPagesPerWeek: z.number().int().positive().optional(),
        favoriteGenres: z.string().optional(),
        notificationsEnabled: z.boolean().optional(),
      }))
      .mutation(({ ctx, input }) => db.updateUserOnboarding(ctx.user.id, input)),
  }),
  
  // Admin routes (require admin role)
  admin: router({
    // Get all users
    users: protectedProcedure
      .input(z.object({ 
        limit: z.number().default(100),
        offset: z.number().default(0)
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        return db.getAllUsers(input.limit, input.offset);
      }),
    
    // Get user counts by tier
    userCounts: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        return db.getUserCount();
      }),
    
    // Get engagement metrics
    metrics: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        return db.getEngagementMetrics();
      }),
    
    // Get curated lists
    curatedLists: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        return db.getCuratedLists();
      }),
    
    // Update user role
    updateUserRole: protectedProcedure
      .input(z.object({
        userId: z.number(),
        role: z.enum(["user", "admin"])
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        await db.updateUserRole(input.userId, input.role);
        return { success: true };
      }),
    
    // Delete user
    deleteUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        await db.deleteUser(input.userId);
        return { success: true };
      }),
  }),
  
  // Public admin API for standalone dashboard (uses secret key auth)
  adminPublic: router({
    // Get all data for admin dashboard
    dashboard: publicProcedure
      .input(z.object({ secretKey: z.string() }))
      .query(async ({ input }) => {
        // Simple secret key auth for standalone admin dashboard
        const adminSecret = process.env.ADMIN_SECRET || 'ivyreader-admin-2026';
        if (input.secretKey !== adminSecret) {
          throw new Error("Unauthorized: Invalid admin key");
        }
        
        const [userCounts, metrics, users] = await Promise.all([
          db.getUserCount(),
          db.getEngagementMetrics(),
          db.getAllUsers(100, 0)
        ]);
        
        return {
          userCounts,
          metrics,
          users
        };
      }),
    
    // Update user tier
    updateUserTier: publicProcedure
      .input(z.object({ 
        secretKey: z.string(),
        userId: z.number(),
        tier: z.enum(['free', 'premium', 'elite'])
      }))
      .mutation(async ({ input }) => {
        const adminSecret = process.env.ADMIN_SECRET || 'ivyreader-admin-2026';
        if (input.secretKey !== adminSecret) {
          throw new Error("Unauthorized: Invalid admin key");
        }
        await db.updateUserSubscriptionTier(input.userId, input.tier);
        return { success: true };
      }),
    
    // Delete user
    deleteUser: publicProcedure
      .input(z.object({ 
        secretKey: z.string(),
        userId: z.number()
      }))
      .mutation(async ({ input }) => {
        const adminSecret = process.env.ADMIN_SECRET || 'ivyreader-admin-2026';
        if (input.secretKey !== adminSecret) {
          throw new Error("Unauthorized: Invalid admin key");
        }
        await db.deleteUser(input.userId);
        return { success: true };
      }),
    
    // Send verification email (stores token, actual email sending handled separately)
    sendVerificationEmail: publicProcedure
      .input(z.object({ 
        secretKey: z.string(),
        userId: z.number()
      }))
      .mutation(async ({ input }) => {
        const adminSecret = process.env.ADMIN_SECRET || 'ivyreader-admin-2026';
        if (input.secretKey !== adminSecret) {
          throw new Error("Unauthorized: Invalid admin key");
        }
        const token = generateVerificationToken();
        const expiresAt = getTokenExpiration();
        await db.setEmailVerificationToken(input.userId, token, expiresAt);
        return { success: true, token };
      }),
  }),
  
  notifications: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(({ ctx, input }) => db.getNotifications(ctx.user.id, input.limit)),
    
    unreadCount: protectedProcedure
      .query(({ ctx }) => db.getUnreadNotificationCount(ctx.user.id)),
    
    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(({ input }) => db.markNotificationAsRead(input.notificationId)),
    
    markAllAsRead: protectedProcedure
      .mutation(({ ctx }) => db.markAllNotificationsAsRead(ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
