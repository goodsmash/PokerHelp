import { users, pokerSessions, type User, type InsertUser, type PokerSession, type InsertPokerSession } from "@shared/schema";

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
    const session: PokerSession = { ...insertSession, id };
    this.sessions.set(id, session);
    return session;
  }

  async getUserSessions(userId: number): Promise<PokerSession[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId,
    );
  }
}

export const storage = new MemStorage();
