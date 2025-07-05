import {
  users,
  personnel,
  cases,
  duties,
  alerts,
  communications,
  type User,
  type UpsertUser,
  type Personnel,
  type InsertPersonnel,
  type Case,
  type InsertCase,
  type Duty,
  type InsertDuty,
  type Alert,
  type InsertAlert,
  type Communication,
  type InsertCommunication,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, ilike, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Personnel operations
  getAllPersonnel(): Promise<Personnel[]>;
  getPersonnelById(id: number): Promise<Personnel | undefined>;
  createPersonnel(personnel: InsertPersonnel): Promise<Personnel>;
  updatePersonnel(id: number, personnel: Partial<InsertPersonnel>): Promise<Personnel>;
  deletePersonnel(id: number): Promise<void>;
  getOnDutyPersonnel(): Promise<Personnel[]>;
  updatePersonnelDutyStatus(id: number, isOnDuty: boolean, location?: string): Promise<Personnel>;

  // Case operations
  getAllCases(): Promise<Case[]>;
  getCaseById(id: number): Promise<Case | undefined>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: number, caseData: Partial<InsertCase>): Promise<Case>;
  deleteCase(id: number): Promise<void>;
  getRecentCases(limit?: number): Promise<Case[]>;
  getCasesByStatus(status: string): Promise<Case[]>;
  searchCases(query: string): Promise<Case[]>;

  // Duty operations
  getAllDuties(): Promise<Duty[]>;
  getDutyById(id: number): Promise<Duty | undefined>;
  createDuty(duty: InsertDuty): Promise<Duty>;
  updateDuty(id: number, duty: Partial<InsertDuty>): Promise<Duty>;
  deleteDuty(id: number): Promise<void>;
  getDutiesByPersonnel(personnelId: number): Promise<Duty[]>;
  getPendingDuties(): Promise<Duty[]>;

  // Alert operations
  getAllAlerts(): Promise<Alert[]>;
  getAlertById(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, alert: Partial<InsertAlert>): Promise<Alert>;
  deleteAlert(id: number): Promise<void>;
  getActiveAlerts(): Promise<Alert[]>;

  // Communication operations
  getAllCommunications(): Promise<Communication[]>;
  getCommunicationById(id: number): Promise<Communication | undefined>;
  createCommunication(communication: InsertCommunication): Promise<Communication>;
  updateCommunication(id: number, communication: Partial<InsertCommunication>): Promise<Communication>;
  deleteCommunication(id: number): Promise<void>;

  // Dashboard statistics
  getDashboardStats(): Promise<{
    totalPersonnel: number;
    activeCases: number;
    pendingDuties: number;
    activeAlerts: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Personnel operations
  async getAllPersonnel(): Promise<Personnel[]> {
    return await db.select().from(personnel).orderBy(desc(personnel.createdAt));
  }

  async getPersonnelById(id: number): Promise<Personnel | undefined> {
    const [person] = await db.select().from(personnel).where(eq(personnel.id, id));
    return person;
  }

  async createPersonnel(personnelData: InsertPersonnel): Promise<Personnel> {
    const [person] = await db.insert(personnel).values(personnelData).returning();
    return person;
  }

  async updatePersonnel(id: number, personnelData: Partial<InsertPersonnel>): Promise<Personnel> {
    const [person] = await db
      .update(personnel)
      .set({ ...personnelData, updatedAt: new Date() })
      .where(eq(personnel.id, id))
      .returning();
    return person;
  }

  async deletePersonnel(id: number): Promise<void> {
    await db.delete(personnel).where(eq(personnel.id, id));
  }

  async getOnDutyPersonnel(): Promise<Personnel[]> {
    return await db.select().from(personnel).where(eq(personnel.isOnDuty, true));
  }

  async updatePersonnelDutyStatus(id: number, isOnDuty: boolean, location?: string): Promise<Personnel> {
    const [person] = await db
      .update(personnel)
      .set({ 
        isOnDuty, 
        currentLocation: location,
        updatedAt: new Date() 
      })
      .where(eq(personnel.id, id))
      .returning();
    return person;
  }

  // Case operations
  async getAllCases(): Promise<Case[]> {
    return await db.select().from(cases).orderBy(desc(cases.createdAt));
  }

  async getCaseById(id: number): Promise<Case | undefined> {
    const [caseData] = await db.select().from(cases).where(eq(cases.id, id));
    return caseData;
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const [newCase] = await db.insert(cases).values(caseData).returning();
    return newCase;
  }

  async updateCase(id: number, caseData: Partial<InsertCase>): Promise<Case> {
    const [updatedCase] = await db
      .update(cases)
      .set({ ...caseData, updatedAt: new Date() })
      .where(eq(cases.id, id))
      .returning();
    return updatedCase;
  }

  async deleteCase(id: number): Promise<void> {
    await db.delete(cases).where(eq(cases.id, id));
  }

  async getRecentCases(limit = 10): Promise<Case[]> {
    return await db.select().from(cases).orderBy(desc(cases.createdAt)).limit(limit);
  }

  async getCasesByStatus(status: string): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.status, status));
  }

  async searchCases(query: string): Promise<Case[]> {
    return await db.select().from(cases).where(
      or(
        ilike(cases.caseNumber, `%${query}%`),
        ilike(cases.title, `%${query}%`),
        ilike(cases.description, `%${query}%`)
      )
    );
  }

  // Duty operations
  async getAllDuties(): Promise<Duty[]> {
    return await db.select().from(duties).orderBy(desc(duties.createdAt));
  }

  async getDutyById(id: number): Promise<Duty | undefined> {
    const [duty] = await db.select().from(duties).where(eq(duties.id, id));
    return duty;
  }

  async createDuty(dutyData: InsertDuty): Promise<Duty> {
    const [duty] = await db.insert(duties).values(dutyData).returning();
    return duty;
  }

  async updateDuty(id: number, dutyData: Partial<InsertDuty>): Promise<Duty> {
    const [duty] = await db
      .update(duties)
      .set({ ...dutyData, updatedAt: new Date() })
      .where(eq(duties.id, id))
      .returning();
    return duty;
  }

  async deleteDuty(id: number): Promise<void> {
    await db.delete(duties).where(eq(duties.id, id));
  }

  async getDutiesByPersonnel(personnelId: number): Promise<Duty[]> {
    return await db.select().from(duties).where(eq(duties.assignedTo, personnelId));
  }

  async getPendingDuties(): Promise<Duty[]> {
    return await db.select().from(duties).where(eq(duties.status, 'pending'));
  }

  // Alert operations
  async getAllAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async getAlertById(id: number): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert;
  }

  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(alertData).returning();
    return alert;
  }

  async updateAlert(id: number, alertData: Partial<InsertAlert>): Promise<Alert> {
    const [alert] = await db
      .update(alerts)
      .set(alertData)
      .where(eq(alerts.id, id))
      .returning();
    return alert;
  }

  async deleteAlert(id: number): Promise<void> {
    await db.delete(alerts).where(eq(alerts.id, id));
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.isRead, false));
  }

  // Communication operations
  async getAllCommunications(): Promise<Communication[]> {
    return await db.select().from(communications).orderBy(desc(communications.createdAt));
  }

  async getCommunicationById(id: number): Promise<Communication | undefined> {
    const [communication] = await db.select().from(communications).where(eq(communications.id, id));
    return communication;
  }

  async createCommunication(communicationData: InsertCommunication): Promise<Communication> {
    const [communication] = await db.insert(communications).values(communicationData).returning();
    return communication;
  }

  async updateCommunication(id: number, communicationData: Partial<InsertCommunication>): Promise<Communication> {
    const [communication] = await db
      .update(communications)
      .set(communicationData)
      .where(eq(communications.id, id))
      .returning();
    return communication;
  }

  async deleteCommunication(id: number): Promise<void> {
    await db.delete(communications).where(eq(communications.id, id));
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<{
    totalPersonnel: number;
    activeCases: number;
    pendingDuties: number;
    activeAlerts: number;
  }> {
    const [totalPersonnelResult] = await db.select({ count: count() }).from(personnel);
    const [activeCasesResult] = await db.select({ count: count() }).from(cases).where(
      or(eq(cases.status, 'open'), eq(cases.status, 'under_investigation'))
    );
    const [pendingDutiesResult] = await db.select({ count: count() }).from(duties).where(
      eq(duties.status, 'pending')
    );
    const [activeAlertsResult] = await db.select({ count: count() }).from(alerts).where(
      eq(alerts.isRead, false)
    );

    return {
      totalPersonnel: totalPersonnelResult.count,
      activeCases: activeCasesResult.count,
      pendingDuties: pendingDutiesResult.count,
      activeAlerts: activeAlertsResult.count,
    };
  }
}

export const storage = new DatabaseStorage();
