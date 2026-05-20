import { Router } from "express";
import { db, connectionsTable, customersTable, complaintsTable } from "@workspace/db";
import { count, eq, sql } from "drizzle-orm";

const router = Router();

router.get("/admin/stats", async (req, res) => {
  try {
    const [totalCustomers] = await db.select({ count: count() }).from(customersTable);
    const [activeConnections] = await db.select({ count: count() }).from(customersTable).where(eq(customersTable.status, "active"));
    const [pendingRequests] = await db.select({ count: count() }).from(connectionsTable).where(eq(connectionsTable.status, "pending"));
    const [openComplaints] = await db.select({ count: count() }).from(complaintsTable).where(eq(complaintsTable.status, "open"));

    // Simple monthly revenue estimate: active customers * avg plan price
    const monthlyRevenue = (activeConnections?.count ?? 0) * 520;

    // New connections this month
    const [newConnections] = await db.select({ count: count() }).from(connectionsTable)
      .where(sql`created_at >= date_trunc('month', now())`);

    res.json({
      totalCustomers: totalCustomers?.count ?? 0,
      activeConnections: activeConnections?.count ?? 0,
      pendingRequests: pendingRequests?.count ?? 0,
      openComplaints: openComplaints?.count ?? 0,
      monthlyRevenue,
      newConnectionsThisMonth: newConnections?.count ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get admin stats");
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

export default router;
