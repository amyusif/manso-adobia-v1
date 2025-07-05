import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  password: varchar("password").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("personnel"), // district_commander, unit_supervisor, admin, personnel
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personnel table
export const personnel = pgTable("personnel", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  badgeNumber: varchar("badge_number").unique().notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  rank: varchar("rank").notNull(), // Constable, Corporal, Sergeant, Inspector, etc.
  unit: varchar("unit").notNull(), // Patrol, Investigation, Admin, etc.
  phone: varchar("phone"),
  email: varchar("email"),
  status: varchar("status").notNull().default("active"), // active, on_leave, suspended
  isOnDuty: boolean("is_on_duty").default(false),
  currentLocation: varchar("current_location"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cases table
export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseNumber: varchar("case_number").unique().notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // theft, assault, burglary, etc.
  status: varchar("status").notNull().default("open"), // open, under_investigation, closed
  priority: varchar("priority").notNull().default("medium"), // low, medium, high, urgent
  assignedTo: integer("assigned_to").references(() => personnel.id),
  reportedBy: varchar("reported_by"),
  reportedAt: timestamp("reported_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Duties table
export const duties = pgTable("duties", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  assignedTo: integer("assigned_to").references(() => personnel.id),
  location: varchar("location"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: varchar("status").notNull().default("pending"), // pending, in_progress, completed, cancelled
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // emergency, warning, info
  priority: varchar("priority").notNull().default("medium"), // low, medium, high, urgent
  sentBy: varchar("sent_by").references(() => users.id),
  recipients: text("recipients"), // JSON array of recipient IDs
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Communications table
export const communications = pgTable("communications", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // sms, email, circular
  subject: varchar("subject"),
  message: text("message").notNull(),
  sender: varchar("sender").references(() => users.id),
  recipients: text("recipients"), // JSON array of recipient IDs
  status: varchar("status").notNull().default("pending"), // pending, sent, failed
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  personnel: many(personnel),
  dutiesCreated: many(duties),
  alertsSent: many(alerts),
  communications: many(communications),
}));

export const personnelRelations = relations(personnel, ({ one, many }) => ({
  user: one(users, { fields: [personnel.userId], references: [users.id] }),
  casesAssigned: many(cases),
  dutiesAssigned: many(duties),
}));

export const casesRelations = relations(cases, ({ one }) => ({
  assignedOfficer: one(personnel, { fields: [cases.assignedTo], references: [personnel.id] }),
}));

export const dutiesRelations = relations(duties, ({ one }) => ({
  assignedOfficer: one(personnel, { fields: [duties.assignedTo], references: [personnel.id] }),
  creator: one(users, { fields: [duties.createdBy], references: [users.id] }),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  sender: one(users, { fields: [alerts.sentBy], references: [users.id] }),
}));

export const communicationsRelations = relations(communications, ({ one }) => ({
  sender: one(users, { fields: [communications.sender], references: [users.id] }),
}));

// Insert schemas
export const insertPersonnelSchema = createInsertSchema(personnel).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCaseSchema = createInsertSchema(cases).omit({ id: true, createdAt: true, updatedAt: true });
export const insertDutySchema = createInsertSchema(duties).omit({ id: true, createdAt: true, updatedAt: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true });
export const insertCommunicationSchema = createInsertSchema(communications).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Personnel = typeof personnel.$inferSelect;
export type InsertPersonnel = z.infer<typeof insertPersonnelSchema>;
export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Duty = typeof duties.$inferSelect;
export type InsertDuty = z.infer<typeof insertDutySchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Communication = typeof communications.$inferSelect;
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;
