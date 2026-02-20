/**
 * Better Auth database schema.
 *
 * These 4 tables are managed exclusively by Better Auth.
 * Do NOT modify their structure without consulting Better Auth docs.
 * The existing `users` table in drizzle/schema.ts is the application
 * profile layer and is linked via the `openId` column (which stores
 * the Better Auth `user.id` UUID).
 */
import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("ba_user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
});

export const session = mysqlTable("ba_session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: varchar("userId", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("ba_account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: varchar("userId", { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow().onUpdateNow(),
});

export const verification = mysqlTable("ba_verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});
