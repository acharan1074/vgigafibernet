import { Router } from "express";
import { Connection, Customer, Complaint } from "@workspace/db";

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

export default router;
