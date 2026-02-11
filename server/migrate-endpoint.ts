import { Router } from "express";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const migrateRouter = Router();

migrateRouter.post("/migrate", async (req, res) => {
  try {
    const dsn = process.env.DATABASE_URL;
    if (!dsn) {
      return res.status(500).json({ error: "DATABASE_URL not configured" });
    }

    const client = postgres(dsn);
    const db = drizzle(client);

    // Create users table
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
  } catch (error: any) {
    console.error("Migration error:", error);
    res.status(500).json({ error: error.message });
  }
});
