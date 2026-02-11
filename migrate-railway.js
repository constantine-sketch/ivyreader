const { Client } = require('pg');

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database');

    const createTableSQL = `
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
      );
    `;

    await client.query(createTableSQL);
    console.log('✅ Users table created successfully');

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
