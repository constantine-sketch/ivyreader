/**
 * Better Auth Express integration.
 *
 * This replaces the Manus OAuth routes in oauth.ts.
 * Better Auth mounts all its handlers at /api/auth/* automatically.
 *
 * Additional custom routes:
 * - GET  /api/auth/me       — returns the current authenticated user (app profile)
 * - POST /api/auth/logout   — clears the session cookie
 *
 * The session cookie name is "app_session_id" (matches COOKIE_NAME in shared/const.ts).
 * Better Auth's session token is a signed opaque token — the SDK's verifySession
 * is updated to validate it via Better Auth's API.
 */
import type { Express, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./better-auth";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { COOKIE_NAME } from "../../shared/const";

/**
 * Sync a Better Auth user into the IvyReader `users` table.
 * Creates a new profile row if one doesn't exist for this Better Auth user ID.
 * The `openId` column stores the Better Auth user UUID.
 */
async function syncBetterAuthUser(baUserId: string, email: string, name?: string | null) {
  const db = await getDb();
  if (!db) return null;

  // Check if a profile already exists for this Better Auth user
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.openId, baUserId))
    .limit(1);

  if (existing.length > 0) {
    // Update lastSignedIn
    await db
      .update(users)
      .set({ lastSignedIn: new Date(), email: email || existing[0].email })
      .where(eq(users.openId, baUserId));
    return existing[0];
  }

  // Create a new profile
  await db.insert(users).values({
    openId: baUserId,
    email: email,
    name: name || email.split("@")[0],
    loginMethod: "email",
    lastSignedIn: new Date(),
  });

  const created = await db
    .select()
    .from(users)
    .where(eq(users.openId, baUserId))
    .limit(1);

  return created[0] || null;
}

export function registerAuthRoutes(app: Express) {
  // Mount Better Auth handler at /api/auth/*
  // This handles: sign-in, sign-up, sign-out, session, verify-email, etc.
  const handler = toNodeHandler(auth);
  app.all("/api/auth/*", handler);

  // Custom /api/auth/me endpoint — returns the IvyReader app profile
  // Works with the Better Auth session cookie
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session?.user) {
        res.status(401).json({ error: "Not authenticated", user: null });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(503).json({ error: "Database unavailable" });
        return;
      }

      // Sync and return the app profile
      const profile = await syncBetterAuthUser(
        session.user.id,
        session.user.email,
        session.user.name,
      );

      if (!profile) {
        res.status(404).json({ error: "User profile not found" });
        return;
      }

      res.json({
        user: {
          id: profile.id,
          openId: profile.openId,
          name: profile.name,
          email: profile.email,
          username: profile.username,
          avatar: profile.avatar,
          loginMethod: profile.loginMethod,
          subscriptionTier: profile.subscriptionTier,
          onboardingCompleted: profile.onboardingCompleted,
          lastSignedIn: profile.lastSignedIn?.toISOString(),
        },
      });
    } catch (error) {
      console.error("[Auth] /api/auth/me failed:", error);
      res.status(401).json({ error: "Not authenticated", user: null });
    }
  });
}

export { syncBetterAuthUser };
