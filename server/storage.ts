import { type GameSession, type InsertGameSession } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Game session operations
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getGameSession(id: string): Promise<GameSession | undefined>;
  updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | undefined>;
  getAllGameSessions(): Promise<GameSession[]>;
  getRecentGameSessions(limit: number): Promise<GameSession[]>;
}

export class MemStorage implements IStorage {
  private gameSessions: Map<string, GameSession>;

  constructor() {
    this.gameSessions = new Map();
  }

  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = randomUUID();
    const session: GameSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
      result: null,
      won: null,
      payout: null,
    };
    this.gameSessions.set(id, session);
    return session;
  }

  async getGameSession(id: string): Promise<GameSession | undefined> {
    return this.gameSessions.get(id);
  }

  async updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | undefined> {
    const session = this.gameSessions.get(id);
    if (!session) return undefined;

    const updatedSession = { ...session, ...updates };
    this.gameSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getAllGameSessions(): Promise<GameSession[]> {
    return Array.from(this.gameSessions.values());
  }

  async getRecentGameSessions(limit: number = 10): Promise<GameSession[]> {
    const allSessions = Array.from(this.gameSessions.values());
    return allSessions
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
