import { Router } from "express";
import { Connection, Customer, Complaint, Plan } from "@workspace/db";

const router = Router();

router.get("/admin/stats", async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const activeConnections = await Customer.countDocuments({ status: "active" });
    const pendingRequests = await Connection.countDocuments({ status: "pending" });
    const openComplaints = await Complaint.countDocuments({ status: "open" });

    // Simple monthly revenue estimate: active customers * avg plan price
    const monthlyRevenue = activeConnections * 520;

    // New connections this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newConnectionsThisMonth = await Connection.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      totalCustomers,
      activeConnections,
      pendingRequests,
      openComplaints,
      monthlyRevenue,
      newConnectionsThisMonth,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get admin stats");
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

router.post("/admin/seed", async (req, res) => {
  try {
    // 1. Seed Plans if none exist
    const existingPlans = await Plan.countDocuments();
    if (existingPlans === 0) {
      await Plan.insertMany([
        { name: "SD 20 Mbps", category: "sd_tv", speed: 20, price: 530, features: ["SD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "1000+ Telugu Channels"], isPopular: false },
        { name: "SD 30 Mbps", category: "sd_tv", speed: 30, price: 520, features: ["SD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "1000+ Telugu Channels"], isPopular: false },
        { name: "SD 50 Mbps", category: "sd_tv", speed: 50, price: 560, features: ["SD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "1000+ Telugu Channels"], isPopular: false },
        { name: "HD 20 Mbps", category: "hd_tv", speed: 20, price: 550, features: ["HD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "OTT Access"], isPopular: false },
        { name: "HD 30 Mbps", category: "hd_tv", speed: 30, price: 540, features: ["HD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "OTT Access"], isPopular: true },
        { name: "HD 50 Mbps", category: "hd_tv", speed: 50, price: 580, features: ["HD TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "OTT Access"], isPopular: false },
        { name: "Net 20 Mbps", category: "internet_only", speed: 20, price: 360, features: ["No TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "Static IP Available"], isPopular: false },
        { name: "Net 30 Mbps", category: "internet_only", speed: 30, price: 350, features: ["No TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "Static IP Available"], isPopular: false },
        { name: "Net 50 Mbps", category: "internet_only", speed: 50, price: 390, features: ["No TV Channels", "Unlimited Data", "Free Installation", "24x7 Support", "Static IP Available"], isPopular: false },
      ]);
    }
    
    // 2. Seed some dummy customers and connections if none exist
    const existingCustomers = await Customer.countDocuments();
    if (existingCustomers === 0) {
      const plan = await Plan.findOne();
      await Customer.insertMany([
        { fullName: "Test User 1", mobile: "9876543210", email: "test1@example.com", village: "Village A", address: "H.No 1-2, Street", locationCoordinates: "0,0", planId: plan?._id, status: "active", dataUsedGB: 10, dataLimitGB: 1000, installationDate: new Date(), dueDate: "2026-09-01" },
        { fullName: "Test User 2", mobile: "9876543211", email: "test2@example.com", village: "Village B", address: "H.No 3-4, Street", locationCoordinates: "0,0", planId: plan?._id, status: "active", dataUsedGB: 50, dataLimitGB: 1000, installationDate: new Date(), dueDate: "2026-09-05" }
      ]);
      await Connection.insertMany([
        { fullName: "Test Pending 1", mobile: "9998887776", email: "pending1@example.com", village: "Village C", address: "H.No 5, Road", connectionType: "new", status: "pending", planInterest: plan?._id, preferredTime: "Morning" }
      ]);
    }

    res.json({ success: true, message: "Database seeded successfully!" });
  } catch (err) {
    req.log.error({ err }, "Failed to seed database");
    res.status(500).json({ error: "Failed to seed database" });
  }
});

export default router;
