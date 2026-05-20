import { Router } from "express";
import { db } from "@workspace/db";
import { plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/plans", async (req, res) => {
  try {
    const plans = await db.select().from(plansTable).orderBy(plansTable.category, plansTable.speed);
    res.json(plans);
  } catch (err) {
    req.log.error({ err }, "Failed to list plans");
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

export default router;
