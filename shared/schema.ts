import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const pokerSessions = pgTable("poker_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  handAnalyzed: text("hand_analyzed").notNull(),
  position: text("position").notNull(),
  recommendation: text("recommendation").notNull(),
  handStrength: real("hand_strength").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPokerSessionSchema = createInsertSchema(pokerSessions).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPokerSession = z.infer<typeof insertPokerSessionSchema>;
export type PokerSession = typeof pokerSessions.$inferSelect;

// Poker-specific types
export interface Card {
  rank: string;
  suit: string;
  value: number;
}

export interface HandAnalysis {
  handType: string;
  handStrength: number;
  bssRank: string;
  odds: {
    vsRandom: number;
    vsPremium: number;
  };
  expectedValue: number;
}

export interface ActionRecommendation {
  action: 'FOLD' | 'CALL' | 'RAISE' | 'ALL-IN';
  sizing?: string;
  description: string;
  reasoning: string;
  vs3bet?: string;
}

export interface PositionRange {
  position: string;
  range: string[];
  percentage: number;
  combos: number;
}
