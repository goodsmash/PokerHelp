import { users, pokerSessions, type User, type InsertUser, type PokerSession, type InsertPokerSession } from "../shared/schema.js";
import { db } from "./db.js";
import { eq } from "drizzle-orm";

function requireDb() {
  if (!db) throw new Error("DATABASE_URL is not configured");
  return db;
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPokerSession(session: InsertPokerSession): Promise<PokerSession>;
  getUserSessions(userId: number): Promise<PokerSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sessions: Map<number, PokerSession>;
  private currentUserId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPokerSession(insertSession: InsertPokerSession): Promise<PokerSession> {
    const id = this.currentSessionId++;
    const session: PokerSession = { userId: insertSession.userId ?? null, ...insertSession, id };
    this.sessions.set(id, session);
    return session;
  }

  async getUserSessions(userId: number): Promise<PokerSession[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId,
    );
  }
}

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await requireDb().select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await requireDb().select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await requireDb()
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createPokerSession(insertSession: InsertPokerSession): Promise<PokerSession> {
    const [session] = await requireDb()
      .insert(pokerSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getUserSessions(userId: number): Promise<PokerSession[]> {
    return await requireDb()
      .select()
      .from(pokerSessions)
      .where(eq(pokerSessions.userId, userId));
  }
}

export const storage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemStorage();
