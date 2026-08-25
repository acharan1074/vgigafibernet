import { Router } from "express";
import { Plan } from "@workspace/db";

const router = Router();

router.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.find().sort({ category: 1, speed: 1 });
    res.json(plans.map(p => p.toJSON()));
  } catch (err) {
    req.log.error({ err }, "Failed to list plans");
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

export default router;
