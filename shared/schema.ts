import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Game types
export const gameTypes = ["coinflip", "dice", "roulette"] as const;
export type GameType = typeof gameTypes[number];

// Game sessions table (active and completed games)
export const gameSessions = pgTable("game_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  gameType: text("game_type").notNull(),
  betAmount: decimal("bet_amount", { precision: 10, scale: 2 }).notNull(),
  prediction: text("prediction").notNull(), // "heads", "tails", "1-6", "0-36", "red", "black"
  result: text("result"), // actual outcome
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
