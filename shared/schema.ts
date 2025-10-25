import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  tonAddress: text("ton_address").notNull().unique(),
  balance: decimal("balance", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  balance: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Deposits table
export const depositStatuses = ["pending", "confirmed", "failed"] as const;
export type DepositStatus = typeof depositStatuses[number];

export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  txHash: text("tx_hash").unique(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
});

export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;

// Withdrawals table
export const withdrawalStatuses = ["pending", "processing", "completed", "failed"] as const;
export type WithdrawalStatus = typeof withdrawalStatuses[number];

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  toAddress: text("to_address").notNull(),
  txHash: text("tx_hash"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  createdAt: true,
  txHash: true,
});

export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;

// Game types
export const gameTypes = ["coinflip", "dice", "roulette"] as const;
export type GameType = typeof gameTypes[number];

// Game sessions table (active and completed games) - now linked to users
export const gameSessions = pgTable("game_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: integer("user_id").notNull().references(() => users.id),
  gameType: text("game_type").notNull(),
  betAmount: decimal("bet_amount", { precision: 10, scale: 2 }).notNull(),
  prediction: text("prediction").notNull(),
  result: text("result"),
  won: boolean("won"),
  payout: decimal("payout", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
  createdAt: true,
});

export const createGameSchema = z.object({
  gameType: z.enum(gameTypes),
  betAmount: z.number().positive().max(1000),
  prediction: z.union([z.string(), z.number()]).transform(val => String(val)),
});

export const playGameSchema = z.object({
  sessionId: z.string(),
});

export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameSession = typeof gameSessions.$inferSelect;
export type CreateGame = z.infer<typeof createGameSchema>;
export type PlayGame = z.infer<typeof playGameSchema>;
