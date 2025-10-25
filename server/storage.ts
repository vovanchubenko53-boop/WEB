import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Deposit,
  type InsertDeposit,
  type Withdrawal,
  type InsertWithdrawal,
  type GameSession,
  type InsertGameSession,
  users,
  deposits,
  withdrawals,
  gameSessions,
} from "@shared/schema";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByAddress(tonAddress: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  updateUserBalance(userId: number, newBalance: string): Promise<User | undefined>;
  
  // Deposit operations
  createDeposit(deposit: InsertDeposit): Promise<Deposit>;
  getDepositByTxHash(txHash: string): Promise<Deposit | undefined>;
  updateDepositStatus(id: number, status: string, txHash?: string): Promise<Deposit | undefined>;
  getPendingDeposits(): Promise<Deposit[]>;
  getUserDeposits(userId: number): Promise<Deposit[]>;
  
  // Withdrawal operations
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  getWithdrawalById(id: number): Promise<Withdrawal | undefined>;
  updateWithdrawalStatus(id: number, status: string, txHash?: string): Promise<Withdrawal | undefined>;
  getPendingWithdrawals(): Promise<Withdrawal[]>;
  getUserWithdrawals(userId: number): Promise<Withdrawal[]>;
  
  // Game session operations
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  getGameSession(id: string): Promise<GameSession | undefined>;
  updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | undefined>;
  getAllGameSessions(): Promise<GameSession[]>;
  getRecentGameSessions(limit: number): Promise<GameSession[]>;
  getUserGameSessions(userId: number, limit?: number): Promise<GameSession[]>;
}

export class PostgresStorage implements IStorage {
  private db;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    const sql = neon(databaseUrl);
    this.db = drizzle(sql);
  }

  // User operations
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  async getUserByAddress(tonAddress: string): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.tonAddress, tonAddress))
      .limit(1);
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  async updateUserBalance(userId: number, newBalance: string): Promise<User | undefined> {
    const [user] = await this.db
      .update(users)
      .set({ balance: newBalance })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Deposit operations
  async createDeposit(insertDeposit: InsertDeposit): Promise<Deposit> {
    const [deposit] = await this.db.insert(deposits).values(insertDeposit).returning();
    return deposit;
  }

  async getDepositByTxHash(txHash: string): Promise<Deposit | undefined> {
    const [deposit] = await this.db
      .select()
      .from(deposits)
      .where(eq(deposits.txHash, txHash))
      .limit(1);
    return deposit;
  }

  async updateDepositStatus(id: number, status: string, txHash?: string): Promise<Deposit | undefined> {
    const updateData: any = { status };
    if (txHash) {
      updateData.txHash = txHash;
    }
    
    const [deposit] = await this.db
      .update(deposits)
      .set(updateData)
      .where(eq(deposits.id, id))
      .returning();
    return deposit;
  }

  async getPendingDeposits(): Promise<Deposit[]> {
    return await this.db
      .select()
      .from(deposits)
      .where(eq(deposits.status, "pending"));
  }

  async getUserDeposits(userId: number): Promise<Deposit[]> {
    return await this.db
      .select()
      .from(deposits)
      .where(eq(deposits.userId, userId))
      .orderBy(desc(deposits.createdAt));
  }

  // Withdrawal operations
  async createWithdrawal(insertWithdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const [withdrawal] = await this.db.insert(withdrawals).values(insertWithdrawal).returning();
    return withdrawal;
  }

  async getWithdrawalById(id: number): Promise<Withdrawal | undefined> {
    const [withdrawal] = await this.db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.id, id))
      .limit(1);
    return withdrawal;
  }

  async updateWithdrawalStatus(id: number, status: string, txHash?: string): Promise<Withdrawal | undefined> {
    const updateData: any = { status };
    if (txHash) {
      updateData.txHash = txHash;
    }
    
    const [withdrawal] = await this.db
      .update(withdrawals)
      .set(updateData)
      .where(eq(withdrawals.id, id))
      .returning();
    return withdrawal;
  }

  async getPendingWithdrawals(): Promise<Withdrawal[]> {
    return await this.db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.status, "pending"));
  }

  async getUserWithdrawals(userId: number): Promise<Withdrawal[]> {
    return await this.db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.userId, userId))
      .orderBy(desc(withdrawals.createdAt));
  }

  // Game session operations
  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const [session] = await this.db.insert(gameSessions).values(insertSession).returning();
    return session;
  }

  async getGameSession(id: string): Promise<GameSession | undefined> {
    const [session] = await this.db
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.id, id))
      .limit(1);
    return session;
  }

  async updateGameSession(id: string, updates: Partial<GameSession>): Promise<GameSession | undefined> {
    const [session] = await this.db
      .update(gameSessions)
      .set(updates)
      .where(eq(gameSessions.id, id))
      .returning();
    return session;
  }

  async getAllGameSessions(): Promise<GameSession[]> {
    return await this.db.select().from(gameSessions);
  }

  async getRecentGameSessions(limit: number = 10): Promise<GameSession[]> {
    return await this.db
      .select()
      .from(gameSessions)
      .orderBy(desc(gameSessions.createdAt))
      .limit(limit);
  }

  async getUserGameSessions(userId: number, limit: number = 50): Promise<GameSession[]> {
    return await this.db
      .select()
      .from(gameSessions)
      .where(eq(gameSessions.userId, userId))
      .orderBy(desc(gameSessions.createdAt))
      .limit(limit);
  }
}

export const storage = new PostgresStorage();
