import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import authRoutes from "./routes/auth.js";
import announcementsRoutes from "./routes/announcements.js";
import servicesRoutes from "./routes/services.js";
import contactRoutes from "./routes/contact.js";
import reportsRoutes from "./routes/reports.js";
import adminRoutes from "./routes/admin.js";
import officialsRoutes from "./routes/officials.js";
import subscriptionsRoutes from "./routes/subscriptions.js";
import contentRoutes from "./routes/content.js";
import User from "./models/User.js";
import Department from "./models/Department.js";
import Announcement from "./models/Announcement.js";
import Official from "./models/Official.js";

let dbInitialized = false;

async function connectAndSeed() {
  const uri =
    process.env.MONGO_URI ||
    "mongodb+srv://BayanTrack:BayanTrackBSIT3A@bayantrack.qc3gvju.mongodb.net/bayantrack?appName=BayanTrack";

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }

  if (dbInitialized) return;

  const adminExists = await User.findOne({ username: "admin123" });
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);
    await User.create({
      username: "admin123",
      password: hashedPassword,
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      email: "admin@bayantrack.com",
      contactNumber: "00000000000",
      address: "Barangay Hall",
      status: "active",
    });
  } else {
    await User.updateOne(
      { _id: adminExists._id },
      { status: "active", failedLoginAttempts: 0, lockUntil: null },
    );
  }

  const superAdminExists = await User.findOne({ username: "superAdmin123" });
  if (!superAdminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("superAdmin123", salt);
    await User.create({
      username: "superAdmin123",
      password: hashedPassword,
      role: "superadmin",
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@bayantrack.com",
      contactNumber: "00000000001",
      address: "City Hall",
      status: "active",
    });
  } else {
    await User.updateOne(
      { _id: superAdminExists._id },
      { status: "active", failedLoginAttempts: 0, lockUntil: null },
    );
  }

  const departmentCount = await Department.countDocuments();
  if (departmentCount === 0) {
    await Department.insertMany([
      { name: "Office of the Captain", contactPerson: "Ms. Admin Staff", localNumber: "101" },
      { name: "Barangay Secretary", contactPerson: "Sec. Aquino", localNumber: "102" },
      { name: "Health Center", contactPerson: "Dr. Health Officer", localNumber: "103" },
      { name: "Senior Citizen Desk", contactPerson: "Head OSCA", localNumber: "104" },
      { name: "Disaster / DRRM", contactPerson: "Officer on Duty", localNumber: "105" },
    ]);
  }

  const announcementCount = await Announcement.countDocuments();
  if (announcementCount === 0) {
    await Announcement.insertMany([
      {
        title: "Barangay General Assembly 2026",
        content: "All residents are invited to the upcoming barangay general assembly at the covered court.",
        module: "barangay-updates",
        category: "Event",
        source: "Barangay Council",
        featured: true,
      },
      {
        title: "Emergency Hotline Numbers Updated",
        content: "Updated emergency contact list is now available for all puroks.",
        module: "emergency-hotlines",
        category: "Advisory",
        source: "DRRM Office",
        featured: true,
      },
      {
        title: "PHIVOLCS Advisory: Stay Alert",
        content: "No active major seismic threat reported, but continue monitoring official bulletins.",
        module: "phivolcs-alerts",
        category: "Alert",
        source: "PHIVOLCS",
      },
      {
        title: "Fact Check: No Official Cash Aid Registration Link",
        content: "Any viral link claiming immediate barangay cash aid registration is not official.",
        module: "fact-check",
        category: "Fact Check",
        source: "Barangay Information Office",
      },
    ]);
  }

  const officialCount = await Official.countDocuments();
  if (officialCount === 0) {
    await Official.insertMany([
      {
        name: "Hon. Barangay Captain",
        role: "Punong Barangay",
        level: "barangay",
        rankOrder: 1,
        description: "Leads barangay governance and local policy implementation.",
      },
      {
        name: "Hon. Kagawad 1",
        role: "Barangay Kagawad",
        level: "barangay",
        rankOrder: 2,
        committee: "Committee on Peace and Order",
      },
      {
        name: "Hon. Kagawad 2",
        role: "Barangay Kagawad",
        level: "barangay",
        rankOrder: 3,
        committee: "Committee on Health and Sanitation",
      },
    ]);
  }

  dbInitialized = true;
}

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  void connectAndSeed().catch((err) => {
    console.error("MongoDB init failed:", err);
  });

  // API routes mounted under /api by Vite middleware in dev
  app.use("/auth", authRoutes);
  app.use("/announcements", announcementsRoutes);
  app.use("/services", servicesRoutes);
  app.use("/contact", contactRoutes);
  app.use("/reports", reportsRoutes);
  app.use("/admin", adminRoutes);
  app.use("/officials", officialsRoutes);
  app.use("/subscriptions", subscriptionsRoutes);
  app.use("/content", contentRoutes);

  // Example API routes
  app.get("/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/demo", handleDemo);

  return app;
}
