import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertPokerSessionSchema } from "../shared/schema.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Poker session tracking
  app.post("/api/poker/sessions", async (req, res) => {
    try {
      const sessionData = insertPokerSessionSchema.parse(req.body);
      const session = await storage.createPokerSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  app.get("/api/poker/sessions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sessions = await storage.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(404).json({ message: "Sessions not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
