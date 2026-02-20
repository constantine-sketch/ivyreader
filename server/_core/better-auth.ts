/**
 * Better Auth configuration for IvyReader.
 *
 * Better Auth manages its own `user`, `session`, `account`, and `verification`
 * tables. These are the auth identity layer. The existing `users` table
 * remains the application profile layer, linked via `openId` (which stores
 * the Better Auth user ID).
 *
 * Auth endpoints are mounted at /api/auth/* by the Express handler.
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as authSchema from "./auth-schema";

// Synchronous Drizzle instance for Better Auth only.
// The existing server/db.ts uses an async lazy getter — we keep them separate.
function createBetterAuthDb() {
  const dsn = process.env.DATABASE_URL || process.env.DATABASE_DSN;
  if (!dsn) {
    throw new Error("[BetterAuth] DATABASE_URL is not set");
  }
  const pool = mysql.createPool(dsn);
  return drizzle(pool, { schema: authSchema, mode: "default" });
}

const db = createBetterAuthDb();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || "",
  baseURL: process.env.BETTER_AUTH_URL || "https://ivyreader-api-production.up.railway.app",
  basePath: "/api/auth",

  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Can enable later with email provider
    minPasswordLength: 8,
  },

  session: {
    cookieName: "app_session_id",
    expiresIn: 60 * 60 * 24 * 365, // 1 year in seconds
    updateAge: 60 * 60 * 24, // Refresh session if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  trustedOrigins: [
    "https://app.theivyreader.com",
    "https://ivyreader-webapp.vercel.app",
    "https://theivyreader.com",
    "exp://",
    "ivyreader://",
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:3000", "http://localhost:8081", "exp://**"]
      : []),
  ],

  advanced: {
    crossSubdomainCookies: {
      enabled: true,
      domain: ".theivyreader.com",
    },
    useSecureCookies: process.env.NODE_ENV === "production",
    generateId: () => crypto.randomUUID(),
  },
});

export type Auth = typeof auth;
