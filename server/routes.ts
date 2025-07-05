import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPersonnelSchema, insertCaseSchema, insertDutySchema, insertAlertSchema, insertCommunicationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Personnel routes
  app.get('/api/personnel', isAuthenticated, async (req, res) => {
    try {
      const personnel = await storage.getAllPersonnel();
      res.json(personnel);
    } catch (error) {
      console.error("Error fetching personnel:", error);
      res.status(500).json({ message: "Failed to fetch personnel" });
    }
  });

  app.get('/api/personnel/on-duty', isAuthenticated, async (req, res) => {
    try {
      const onDutyPersonnel = await storage.getOnDutyPersonnel();
      res.json(onDutyPersonnel);
    } catch (error) {
      console.error("Error fetching on-duty personnel:", error);
      res.status(500).json({ message: "Failed to fetch on-duty personnel" });
    }
  });

  app.post('/api/personnel', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPersonnelSchema.parse(req.body);
      const personnel = await storage.createPersonnel(validatedData);
      res.json(personnel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating personnel:", error);
        res.status(500).json({ message: "Failed to create personnel" });
      }
    }
  });

  app.put('/api/personnel/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPersonnelSchema.partial().parse(req.body);
      const personnel = await storage.updatePersonnel(id, validatedData);
      res.json(personnel);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating personnel:", error);
        res.status(500).json({ message: "Failed to update personnel" });
      }
    }
  });

  app.put('/api/personnel/:id/duty-status', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isOnDuty, location } = req.body;
      const personnel = await storage.updatePersonnelDutyStatus(id, isOnDuty, location);
      res.json(personnel);
    } catch (error) {
      console.error("Error updating duty status:", error);
      res.status(500).json({ message: "Failed to update duty status" });
    }
  });

  app.delete('/api/personnel/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePersonnel(id);
      res.json({ message: "Personnel deleted successfully" });
    } catch (error) {
      console.error("Error deleting personnel:", error);
      res.status(500).json({ message: "Failed to delete personnel" });
    }
  });

  // Case routes
  app.get('/api/cases', isAuthenticated, async (req, res) => {
    try {
      const cases = await storage.getAllCases();
      res.json(cases);
    } catch (error) {
      console.error("Error fetching cases:", error);
      res.status(500).json({ message: "Failed to fetch cases" });
    }
  });

  app.get('/api/cases/recent', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const cases = await storage.getRecentCases(limit);
      res.json(cases);
    } catch (error) {
      console.error("Error fetching recent cases:", error);
      res.status(500).json({ message: "Failed to fetch recent cases" });
    }
  });

  app.post('/api/cases', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCaseSchema.parse(req.body);
      const caseData = await storage.createCase(validatedData);
      res.json(caseData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating case:", error);
        res.status(500).json({ message: "Failed to create case" });
      }
    }
  });

  app.put('/api/cases/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCaseSchema.partial().parse(req.body);
      const caseData = await storage.updateCase(id, validatedData);
      res.json(caseData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating case:", error);
        res.status(500).json({ message: "Failed to update case" });
      }
    }
  });

  app.delete('/api/cases/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCase(id);
      res.json({ message: "Case deleted successfully" });
    } catch (error) {
      console.error("Error deleting case:", error);
      res.status(500).json({ message: "Failed to delete case" });
    }
  });

  // Duty routes
  app.get('/api/duties', isAuthenticated, async (req, res) => {
    try {
      const duties = await storage.getAllDuties();
      res.json(duties);
    } catch (error) {
      console.error("Error fetching duties:", error);
      res.status(500).json({ message: "Failed to fetch duties" });
    }
  });

  app.get('/api/duties/pending', isAuthenticated, async (req, res) => {
    try {
      const duties = await storage.getPendingDuties();
      res.json(duties);
    } catch (error) {
      console.error("Error fetching pending duties:", error);
      res.status(500).json({ message: "Failed to fetch pending duties" });
    }
  });

  app.post('/api/duties', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDutySchema.parse(req.body);
      const duty = await storage.createDuty(validatedData);
      res.json(duty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating duty:", error);
        res.status(500).json({ message: "Failed to create duty" });
      }
    }
  });

  app.put('/api/duties/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDutySchema.partial().parse(req.body);
      const duty = await storage.updateDuty(id, validatedData);
      res.json(duty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating duty:", error);
        res.status(500).json({ message: "Failed to update duty" });
      }
    }
  });

  app.delete('/api/duties/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDuty(id);
      res.json({ message: "Duty deleted successfully" });
    } catch (error) {
      console.error("Error deleting duty:", error);
      res.status(500).json({ message: "Failed to delete duty" });
    }
  });

  // Alert routes
  app.get('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.get('/api/alerts/active', isAuthenticated, async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching active alerts:", error);
      res.status(500).json({ message: "Failed to fetch active alerts" });
    }
  });

  app.post('/api/alerts', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating alert:", error);
        res.status(500).json({ message: "Failed to create alert" });
      }
    }
  });

  app.put('/api/alerts/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAlertSchema.partial().parse(req.body);
      const alert = await storage.updateAlert(id, validatedData);
      res.json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating alert:", error);
        res.status(500).json({ message: "Failed to update alert" });
      }
    }
  });

  // Communication routes
  app.get('/api/communications', isAuthenticated, async (req, res) => {
    try {
      const communications = await storage.getAllCommunications();
      res.json(communications);
    } catch (error) {
      console.error("Error fetching communications:", error);
      res.status(500).json({ message: "Failed to fetch communications" });
    }
  });

  app.post('/api/communications', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCommunicationSchema.parse(req.body);
      const communication = await storage.createCommunication(validatedData);
      res.json(communication);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating communication:", error);
        res.status(500).json({ message: "Failed to create communication" });
      }
    }
  });

  // Dashboard stats
  app.get('/api/dashboard/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
