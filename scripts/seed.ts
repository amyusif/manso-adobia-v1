import { db } from "../server/db";
import { users, personnel, cases, duties, alerts, communications } from "../shared/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Create sample personnel records
    console.log("Creating personnel records...");
    const samplePersonnel = [
      {
        userId: "commander",
        badgeNumber: "CMD001",
        firstName: "John",
        lastName: "Doe",
        rank: "Commander",
        unit: "Command",
        phone: "+233-20-123-4567",
        email: "commander@police.gov.gh",
        status: "active",
        isOnDuty: true,
        currentLocation: "Command Center"
      },
      {
        userId: "supervisor",
        badgeNumber: "SUP001",
        firstName: "Jane",
        lastName: "Smith",
        rank: "Inspector",
        unit: "Patrol",
        phone: "+233-20-234-5678",
        email: "supervisor@police.gov.gh",
        status: "active",
        isOnDuty: true,
        currentLocation: "Main Street Patrol"
      },
      {
        userId: "officer",
        badgeNumber: "OFF001",
        firstName: "Robert",
        lastName: "Johnson",
        rank: "Constable",
        unit: "Investigation",
        phone: "+233-20-345-6789",
        email: "officer@police.gov.gh",
        status: "active",
        isOnDuty: false,
        currentLocation: null
      }
    ];

    for (const person of samplePersonnel) {
      await db.insert(personnel).values(person).onConflictDoNothing();
    }

    // Create sample cases
    console.log("Creating sample cases...");
    const sampleCases = [
      {
        caseNumber: "CASE-2024-001",
        title: "Theft at Market Square",
        description: "Reported theft of goods from market vendor",
        type: "theft",
        status: "open",
        priority: "medium",
        assignedTo: 3, // Officer's personnel ID
        reportedBy: "Market Vendor Association",
        reportedAt: new Date()
      },
      {
        caseNumber: "CASE-2024-002",
        title: "Vehicle Accident on Main Road",
        description: "Two-vehicle collision requiring investigation",
        type: "traffic_accident",
        status: "under_investigation",
        priority: "high",
        assignedTo: 2, // Supervisor's personnel ID
        reportedBy: "Traffic Division",
        reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
      }
    ];

    for (const caseData of sampleCases) {
      await db.insert(cases).values(caseData).onConflictDoNothing();
    }

    // Create sample duties
    console.log("Creating sample duties...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(8, 0, 0, 0);

    const endTime = new Date(tomorrow);
    endTime.setHours(16, 0, 0, 0);

    const sampleDuties = [
      {
        title: "Morning Patrol - Market Area",
        description: "Regular patrol of market area during morning hours",
        assignedTo: 2, // Supervisor
        location: "Market Square",
        startTime: tomorrow,
        endTime: endTime,
        status: "pending",
        createdBy: "commander"
      },
      {
        title: "Traffic Control - Main Junction",
        description: "Traffic control during peak hours",
        assignedTo: 3, // Officer
        location: "Main Road Junction",
        startTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
        endTime: new Date(endTime.getTime() + 2 * 60 * 60 * 1000),
        status: "pending",
        createdBy: "commander"
      }
    ];

    for (const duty of sampleDuties) {
      await db.insert(duties).values(duty).onConflictDoNothing();
    }

    // Create sample alerts
    console.log("Creating sample alerts...");
    const sampleAlerts = [
      {
        title: "Security Alert",
        message: "Increased security measures in effect for market area",
        type: "warning",
        priority: "medium",
        sentBy: "commander",
        recipients: JSON.stringify(["supervisor", "officer"]),
        isRead: false
      },
      {
        title: "Weather Advisory",
        message: "Heavy rain expected this evening. Exercise caution on patrols.",
        type: "info",
        priority: "low",
        sentBy: "commander",
        recipients: JSON.stringify(["supervisor", "officer"]),
        isRead: false
      }
    ];

    for (const alert of sampleAlerts) {
      await db.insert(alerts).values(alert).onConflictDoNothing();
    }

    // Create sample communications
    console.log("Creating sample communications...");
    const sampleCommunications = [
      {
        type: "circular",
        subject: "New Security Protocols",
        message: "All personnel are required to follow updated security protocols effective immediately.",
        sender: "commander",
        recipients: JSON.stringify(["supervisor", "officer"]),
        status: "sent",
        sentAt: new Date()
      }
    ];

    for (const comm of sampleCommunications) {
      await db.insert(communications).values(comm).onConflictDoNothing();
    }

    console.log("✅ Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("Seeding finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });