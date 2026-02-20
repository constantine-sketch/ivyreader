/**
 * Startup migration — runs once on server boot.
 *
 * Creates the 4 Better Auth tables (ba_user, ba_session, ba_account, ba_verification)
 * and relaxes the openId NOT NULL constraint on the users table to allow
 * Better Auth UUIDs (which are 36 chars) as the identifier.
 *
 * All statements use CREATE TABLE IF NOT EXISTS / MODIFY COLUMN — safe to run repeatedly.
 */
export async function runStartupMigrations(): Promise<void> {
  const dsn = process.env.DATABASE_URL || process.env.DATABASE_DSN;
  if (!dsn) {
    console.warn("[Migration] DATABASE_URL not set — skipping startup migrations");
    return;
  }

  try {
    let client: any;

    if (dsn.startsWith("postgresql://") || dsn.startsWith("postgres://")) {
      const { default: postgres } = await import("postgres");
      client = postgres(dsn);

      await client`
        CREATE TABLE IF NOT EXISTS ba_user (
          id VARCHAR(36) PRIMARY KEY,
          name TEXT NOT NULL,
          email VARCHAR(320) NOT NULL UNIQUE,
          "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
          image TEXT,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `;

      await client`
        CREATE TABLE IF NOT EXISTS ba_session (
          id VARCHAR(36) PRIMARY KEY,
          "expiresAt" TIMESTAMP NOT NULL,
          token VARCHAR(255) NOT NULL UNIQUE,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "ipAddress" TEXT,
          "userAgent" TEXT,
          "userId" VARCHAR(36) NOT NULL REFERENCES ba_user(id) ON DELETE CASCADE
        )
      `;

      await client`
        CREATE TABLE IF NOT EXISTS ba_account (
          id VARCHAR(36) PRIMARY KEY,
          "accountId" TEXT NOT NULL,
          "providerId" TEXT NOT NULL,
          "userId" VARCHAR(36) NOT NULL REFERENCES ba_user(id) ON DELETE CASCADE,
          "accessToken" TEXT,
          "refreshToken" TEXT,
          "idToken" TEXT,
          "accessTokenExpiresAt" TIMESTAMP,
          "refreshTokenExpiresAt" TIMESTAMP,
          scope TEXT,
          password TEXT,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `;

      await client`
        CREATE TABLE IF NOT EXISTS ba_verification (
          id VARCHAR(36) PRIMARY KEY,
          identifier TEXT NOT NULL,
          value TEXT NOT NULL,
          "expiresAt" TIMESTAMP NOT NULL,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "updatedAt" TIMESTAMP DEFAULT NOW()
        )
      `;

      // Relax openId NOT NULL constraint (safe — already nullable in schema.ts)
      await client`
        ALTER TABLE users ALTER COLUMN "openId" DROP NOT NULL
      `.catch(() => {
        // Column may already be nullable — ignore error
      });

      await client.end();
    } else {
      // MySQL
      const mysql = await import("mysql2/promise");
      const pool = mysql.createPool(dsn);
      const conn = await pool.getConnection();

      await conn.execute(`
        CREATE TABLE IF NOT EXISTS ba_user (
          id VARCHAR(36) PRIMARY KEY,
          name TEXT NOT NULL,
          email VARCHAR(320) NOT NULL,
          emailVerified BOOLEAN NOT NULL DEFAULT FALSE,
          image TEXT,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY ba_user_email_unique (email)
        )
      `);

      await conn.execute(`
        CREATE TABLE IF NOT EXISTS ba_session (
          id VARCHAR(36) PRIMARY KEY,
          expiresAt TIMESTAMP NOT NULL,
          token VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          ipAddress TEXT,
          userAgent TEXT,
          userId VARCHAR(36) NOT NULL,
          UNIQUE KEY ba_session_token_unique (token),
          FOREIGN KEY (userId) REFERENCES ba_user(id) ON DELETE CASCADE
        )
      `);

      await conn.execute(`
        CREATE TABLE IF NOT EXISTS ba_account (
          id VARCHAR(36) PRIMARY KEY,
          accountId TEXT NOT NULL,
          providerId TEXT NOT NULL,
          userId VARCHAR(36) NOT NULL,
          accessToken TEXT,
          refreshToken TEXT,
          idToken TEXT,
          accessTokenExpiresAt TIMESTAMP NULL,
          refreshTokenExpiresAt TIMESTAMP NULL,
          scope TEXT,
          password TEXT,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES ba_user(id) ON DELETE CASCADE
        )
      `);

      await conn.execute(`
        CREATE TABLE IF NOT EXISTS ba_verification (
          id VARCHAR(36) PRIMARY KEY,
          identifier TEXT NOT NULL,
          value TEXT NOT NULL,
          expiresAt TIMESTAMP NOT NULL,
          createdAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Relax openId NOT NULL constraint on users table
      await conn.execute(`
        ALTER TABLE users MODIFY COLUMN openId VARCHAR(64) NULL
      `).catch(() => {
        // Already nullable — ignore
      });

      conn.release();
      await pool.end();
    }

    console.log("[Migration] Better Auth tables created/verified successfully");
  } catch (error) {
    console.error("[Migration] Startup migration failed:", error);
    // Non-fatal — server continues to start
  }
}
