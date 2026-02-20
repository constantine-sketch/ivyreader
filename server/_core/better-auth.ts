/**
 * Better Auth configuration for IvyReader.
 *
 * Better Auth manages its own `user`, `session`, `account`, and `verification`
 * tables. These are the auth identity layer. The existing `users` table
 * remains the application profile layer, linked via `openId` (which stores
 * the Better Auth user ID).
 *
 * Auth endpoints are mounted at /api/auth/* by the Express handler.
 *
 * The Railway database is PostgreSQL — we use the postgres-js driver here,
 * consistent with the rest of the server (server/db.ts).
 *
 * IMPORTANT: The web app (app.theivyreader.com) and the API (railway.app) are
 * on different domains. For the session cookie to be sent cross-origin, it must
 * have SameSite=None; Secure. Better Auth handles this automatically when
 * useSecureCookies is true and the request comes from a trusted origin.
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as authSchema from "./auth-schema";

// Synchronous Drizzle instance for Better Auth only.
// The existing server/db.ts uses an async lazy getter — we keep them separate.
function createBetterAuthDb() {
  const dsn = process.env.DATABASE_URL || process.env.DATABASE_DSN;
  if (!dsn) {
    throw new Error("[BetterAuth] DATABASE_URL is not set");
  }
  const client = postgres(dsn);
  return drizzle(client, { schema: authSchema });
}

const db = createBetterAuthDb();

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || "",
  baseURL: process.env.BETTER_AUTH_URL || "https://ivyreader-api-production.up.railway.app",
  basePath: "/api/auth",

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Can enable later with email provider
    minPasswordLength: 8,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 365, // 1 year in seconds
    updateAge: 60 * 60 * 24, // Refresh session if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // Trusted origins for CORS and cookie validation.
  // The web app is on a different domain than the API, so we must list it here.
  trustedOrigins: [
    "https://app.theivyreader.com",
    "https://ivyreader-webapp.vercel.app",
    "https://theivyreader.com",
    "exp://",
    "ivyreader://",
    ...(process.env.NODE_ENV !== "production"
      ? ["http://localhost:3000", "http://localhost:8081"]
      : []),
  ],

  advanced: {
    // Use secure cookies in production (SameSite=None; Secure for cross-origin)
    useSecureCookies: true,
    generateId: () => crypto.randomUUID(),
    // Do NOT use crossSubdomainCookies — the API is on railway.app, not theivyreader.com
  },
});

export type Auth = typeof auth;
