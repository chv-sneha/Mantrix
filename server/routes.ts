import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateHint, generateChallenge, provideExplanation, getMotivationalMessage } from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // AI Learning Companion Routes
  app.post("/api/ai/hint", async (req, res) => {
    try {
      const { levelId, courseId, userProgress, difficulty } = req.body;
      const hint = await generateHint({ levelId, courseId, userProgress, difficulty });
      res.json({ hint });
    } catch (error) {
      console.error("Error generating hint:", error);
      res.status(500).json({ error: "Failed to generate hint" });
    }
  });

  app.post("/api/ai/challenge", async (req, res) => {
    try {
      const { topic, difficulty, challengeType } = req.body;
      const challenge = await generateChallenge({ topic, difficulty, challengeType });
      res.json(challenge);
    } catch (error) {
      console.error("Error generating challenge:", error);
      res.status(500).json({ error: "Failed to generate challenge" });
    }
  });

  app.post("/api/ai/explanation", async (req, res) => {
    try {
      const { topic, userAnswer, correctAnswer } = req.body;
      const explanation = await provideExplanation(topic, userAnswer, correctAnswer);
      res.json({ explanation });
    } catch (error) {
      console.error("Error generating explanation:", error);
      res.status(500).json({ error: "Failed to generate explanation" });
    }
  });

  app.post("/api/ai/motivation", async (req, res) => {
    try {
      const { completedLevels, totalXP } = req.body;
      const message = await getMotivationalMessage(completedLevels, totalXP);
      res.json({ message });
    } catch (error) {
      console.error("Error generating motivational message:", error);
      res.status(500).json({ error: "Failed to generate message" });
    }
  });

  // Progress tracking routes
  app.post("/api/progress/complete-level", async (req, res) => {
    try {
      const { userId, levelId, xpEarned } = req.body;
      res.json({ success: true, message: "Level completed!" });
    } catch (error) {
      console.error("Error completing level:", error);
      res.status(500).json({ error: "Failed to complete level" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
