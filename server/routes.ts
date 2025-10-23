import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { createGameSchema, playGameSchema } from "@shared/schema";

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
  const outcome = Math.floor(Math.random() * 37); // 0-36
  
  // Check if prediction is a number
  const predictedNumber = parseInt(prediction);
  if (!isNaN(predictedNumber)) {
    const won = outcome === predictedNumber;
    return {
      result: outcome,
      won,
      multiplier: won ? 36 : 0,
    };
  }
  
  // Otherwise it's a color bet
  const outcomeColor = getRouletteColor(outcome);
  const won = outcomeColor === prediction;
  return {
    result: outcome,
    won,
    multiplier: won ? 2 : 0,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new game session
  app.post("/api/games/create", async (req, res) => {
    try {
      const validation = createGameSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid game data", details: validation.error });
      }

      const { gameType, betAmount, prediction } = validation.data;

      const session = await storage.createGameSession({
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

  // Play a game (execute the game logic)
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

      // Execute game logic based on game type
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

      // Calculate payout
      const betAmount = parseFloat(session.betAmount);
      const payout = gameResult.won ? betAmount * gameResult.multiplier : 0;

      // Update session with results
      const updatedSession = await storage.updateGameSession(sessionId, {
        result: gameResult.result.toString(),
        won: gameResult.won,
        payout: payout.toString(),
      });

      return res.json(updatedSession);
    } catch (error) {
      console.error("Error playing game:", error);
      return res.status(500).json({ error: "Failed to play game" });
    }
  });

  // Get game session by ID
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

  // Get recent game history
  app.get("/api/games/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const sessions = await storage.getRecentGameSessions(limit);
      return res.json(sessions);
    } catch (error) {
      console.error("Error fetching game history:", error);
      return res.status(500).json({ error: "Failed to fetch game history" });
    }
  });

  // Get all games (for statistics)
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
