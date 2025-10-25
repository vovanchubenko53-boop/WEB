import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createGameSchema, playGameSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { sendTON, getCasinoWalletAddress } from "./services/ton";
import { Address } from "@ton/core";

// Game logic functions
function playRedNumbers() {
  return [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
}

function getRouletteColor(num: number): 'red' | 'black' | 'green' {
  if (num === 0) return 'green';
  return playRedNumbers().includes(num) ? 'red' : 'black';
}

function playCoinFlip(prediction: string): { result: string; won: boolean; multiplier: number } {
  const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
  const won = outcome === prediction;
  return {
    result: outcome,
    won,
    multiplier: won ? 2 : 0,
  };
}

function playDice(prediction: string): { result: number; won: boolean; multiplier: number } {
  const outcome = Math.floor(Math.random() * 6) + 1;
  const predictedNumber = parseInt(prediction);
  const won = outcome === predictedNumber;
  return {
    result: outcome,
    won,
    multiplier: won ? 6 : 0,
  };
}

function playRoulette(prediction: string): { result: number; won: boolean; multiplier: number } {
  const outcome = Math.floor(Math.random() * 37);
  
  const predictedNumber = parseInt(prediction);
  if (!isNaN(predictedNumber)) {
    const won = outcome === predictedNumber;
    return {
      result: outcome,
      won,
      multiplier: won ? 36 : 0,
    };
  }
  
  const outcomeColor = getRouletteColor(outcome);
  const won = outcomeColor === prediction;
  return {
    result: outcome,
    won,
    multiplier: won ? 2 : 0,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users/register", async (req, res) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid user data", details: validation.error });
      }

      const { tonAddress } = validation.data;
      
      let user = await storage.getUserByAddress(tonAddress);
      if (user) {
        return res.json(user);
      }

      user = await storage.createUser({ tonAddress });
      return res.json(user);
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.get("/api/users/me", async (req, res) => {
    try {
      const tonAddress = req.query.address as string;
      
      if (!tonAddress) {
        return res.status(400).json({ error: "TON address is required" });
      }

      const user = await storage.getUserByAddress(tonAddress);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Deposit routes
  const initiateDepositSchema = z.object({
    tonAddress: z.string(),
    amount: z.number().positive(),
  });

  app.post("/api/deposits/initiate", async (req, res) => {
    try {
      const validation = initiateDepositSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid deposit data", details: validation.error });
      }

      const { tonAddress, amount } = validation.data;

      let user = await storage.getUserByAddress(tonAddress);
      if (!user) {
        user = await storage.createUser({ tonAddress });
      }

      const deposit = await storage.createDeposit({
        userId: user.id,
        amount: amount.toString(),
        status: "pending",
        txHash: null,
      });

      return res.json(deposit);
    } catch (error) {
      console.error("Error initiating deposit:", error);
      return res.status(500).json({ error: "Failed to initiate deposit" });
    }
  });

  app.get("/api/deposits/status/:txHash", async (req, res) => {
    try {
      const { txHash } = req.params;
      
      const deposit = await storage.getDepositByTxHash(txHash);
      
      if (!deposit) {
        return res.status(404).json({ error: "Deposit not found" });
      }

      return res.json(deposit);
    } catch (error) {
      console.error("Error fetching deposit status:", error);
      return res.status(500).json({ error: "Failed to fetch deposit status" });
    }
  });

  // Withdrawal routes
  const requestWithdrawalSchema = z.object({
    tonAddress: z.string(),
    amount: z.number().positive(),
  });

  app.post("/api/withdrawals/request", async (req, res) => {
    try {
      const validation = requestWithdrawalSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid withdrawal data", details: validation.error });
      }

      const { tonAddress, amount } = validation.data;

      const user = await storage.getUserByAddress(tonAddress);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const currentBalance = parseFloat(user.balance);
      if (currentBalance < amount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      const newBalance = (currentBalance - amount).toFixed(2);
      await storage.updateUserBalance(user.id, newBalance);

      const withdrawal = await storage.createWithdrawal({
        userId: user.id,
        amount: amount.toString(),
        toAddress: tonAddress,
        status: "pending",
      });

      try {
        const txHash = await sendTON(tonAddress, amount);
        await storage.updateWithdrawalStatus(withdrawal.id, "completed", txHash);
        
        return res.json({ ...withdrawal, status: "completed", txHash });
      } catch (tonError) {
        console.error("Error sending TON:", tonError);
        await storage.updateWithdrawalStatus(withdrawal.id, "failed");
        await storage.updateUserBalance(user.id, user.balance);
        
        return res.status(500).json({ error: "Failed to process withdrawal" });
      }
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
      return res.status(500).json({ error: "Failed to request withdrawal" });
    }
  });

  app.get("/api/withdrawals/status/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid withdrawal ID" });
      }

      const withdrawal = await storage.getWithdrawalById(id);
      
      if (!withdrawal) {
        return res.status(404).json({ error: "Withdrawal not found" });
      }

      return res.json(withdrawal);
    } catch (error) {
      console.error("Error fetching withdrawal status:", error);
      return res.status(500).json({ error: "Failed to fetch withdrawal status" });
    }
  });

  // Casino configuration routes
  app.get("/api/casino/wallet-address", async (req, res) => {
    try {
      const rawAddress = await getCasinoWalletAddress();
      const address = Address.parse(rawAddress);
      const userFriendlyAddress = address.toString({ bounceable: false });
      
      return res.json({ address: userFriendlyAddress });
    } catch (error) {
      console.error("Error getting casino wallet address:", error);
      return res.status(500).json({ error: "Failed to get casino wallet address" });
    }
  });

  // Game routes - updated to work with user balances
  const createGameWithUserSchema = createGameSchema.extend({
    tonAddress: z.string(),
  });

  app.post("/api/games/create", async (req, res) => {
    try {
      const validation = createGameWithUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid game data", details: validation.error });
      }

      const { gameType, betAmount, prediction, tonAddress } = validation.data;

      let user = await storage.getUserByAddress(tonAddress);
      if (!user) {
        user = await storage.createUser({ tonAddress });
      }

      const currentBalance = parseFloat(user.balance);
      if (currentBalance < betAmount) {
        return res.status(400).json({ error: "Insufficient balance" });
      }

      const newBalance = (currentBalance - betAmount).toFixed(2);
      await storage.updateUserBalance(user.id, newBalance);

      const session = await storage.createGameSession({
        userId: user.id,
        gameType,
        betAmount: betAmount.toString(),
        prediction,
        result: null,
        won: null,
        payout: null,
      });

      return res.json(session);
    } catch (error) {
      console.error("Error creating game:", error);
      return res.status(500).json({ error: "Failed to create game session" });
    }
  });

  app.post("/api/games/play", async (req, res) => {
    try {
      const validation = playGameSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid play data", details: validation.error });
      }

      const { sessionId } = validation.data;
      const session = await storage.getGameSession(sessionId);

      if (!session) {
        return res.status(404).json({ error: "Game session not found" });
      }

      if (session.result !== null) {
        return res.status(400).json({ error: "Game already played" });
      }

      let gameResult: { result: string | number; won: boolean; multiplier: number };

      switch (session.gameType) {
        case 'coinflip':
          gameResult = playCoinFlip(session.prediction);
          break;
        case 'dice':
          gameResult = playDice(session.prediction);
          break;
        case 'roulette':
          gameResult = playRoulette(session.prediction);
          break;
        default:
          return res.status(400).json({ error: "Invalid game type" });
      }

      const betAmount = parseFloat(session.betAmount);
      const payout = gameResult.won ? betAmount * gameResult.multiplier : 0;

      const updatedSession = await storage.updateGameSession(sessionId, {
        result: gameResult.result.toString(),
        won: gameResult.won,
        payout: payout.toString(),
      });

      if (payout > 0) {
        const user = await storage.getUserById(session.userId);
        if (user) {
          const currentBalance = parseFloat(user.balance);
          const newBalance = (currentBalance + payout).toFixed(2);
          await storage.updateUserBalance(user.id, newBalance);
        }
      }

      return res.json(updatedSession);
    } catch (error) {
      console.error("Error playing game:", error);
      return res.status(500).json({ error: "Failed to play game" });
    }
  });

  app.get("/api/games/history", async (req, res) => {
    try {
      const tonAddress = req.query.address as string;
      const limit = parseInt(req.query.limit as string) || 10;
      
      if (tonAddress) {
        const user = await storage.getUserByAddress(tonAddress);
        if (user) {
          const sessions = await storage.getUserGameSessions(user.id, limit);
          return res.json(sessions);
        }
        return res.json([]);
      }

      const sessions = await storage.getRecentGameSessions(limit);
      return res.json(sessions);
    } catch (error) {
      console.error("Error fetching game history:", error);
      return res.status(500).json({ error: "Failed to fetch game history" });
    }
  });

  app.get("/api/games/:id", async (req, res) => {
    try {
      const session = await storage.getGameSession(req.params.id);
      
      if (!session) {
        return res.status(404).json({ error: "Game session not found" });
      }

      return res.json(session);
    } catch (error) {
      console.error("Error fetching game:", error);
      return res.status(500).json({ error: "Failed to fetch game session" });
    }
  });

  app.get("/api/games", async (req, res) => {
    try {
      const sessions = await storage.getAllGameSessions();
      return res.json(sessions);
    } catch (error) {
      console.error("Error fetching all games:", error);
      return res.status(500).json({ error: "Failed to fetch games" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
