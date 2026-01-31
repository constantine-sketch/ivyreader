import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { searchBooks } from "./lib/google-books";

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
    
    // Search books using Google Books API
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
    posts: publicProcedure
      .input(z.object({ limit: z.number().default(20) }))
      .query(({ input }) => db.getSocialPosts(undefined, input.limit)),
    
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
    
    leaderboard: publicProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(({ input }) => db.getWeeklyLeaderboard(input.limit)),
    
    followUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(({ ctx, input }) => db.followUser(ctx.user.id, input.userId)),
    
    following: protectedProcedure.query(({ ctx }) => db.getFollowing(ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
