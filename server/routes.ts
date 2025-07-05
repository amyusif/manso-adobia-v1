import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPersonnelSchema, insertCaseSchema, insertDutySchema, insertAlertSchema, insertCommunicationSchema } from "@shared/schema";
import { z } from "zod";

// Simple in-memory session store (replace with database in production)
const sessions: Map<string, { userId: string; expiresAt: number }> = new Map();

// Simple authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const session = sessions.get(sessionId);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.userId = session.userId;
  next();
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["personnel", "supervisor", "admin", "commander"]),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Simple array-based authentication (replace with proper auth later)
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Create session
      const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days
      
      sessions.set(sessionId, { userId: user.id, expiresAt });
      
      res.json({ sessionId, user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post('/api/auth/signup', async (req, res) => {
    try {
      const userData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });

  app.put('/api/auth/profile', isAuthenticated, async (req: any, res) => {
    try {
      const { firstName, lastName, email, profileImageUrl } = req.body;
      const userId = req.userId;
      
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        lastName,
        email,
        profileImageUrl,
      });
      
      res.json({ ...updatedUser, password: undefined });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
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