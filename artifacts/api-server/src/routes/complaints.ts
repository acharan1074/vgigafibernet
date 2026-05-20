import { Router } from "express";
import { db, complaintsTable } from "@workspace/db";
import { CreateComplaintBody, UpdateComplaintBody, UpdateComplaintParams, ListComplaintsQueryParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/complaints", async (req, res) => {
  try {
    const parsed = ListComplaintsQueryParams.safeParse(req.query);
    const all = await db.select().from(complaintsTable).orderBy(complaintsTable.createdAt);
    const result = parsed.success && parsed.data.status
      ? all.filter(c => c.status === parsed.data.status)
      : all;
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list complaints");
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

router.post("/complaints", async (req, res) => {
  try {
    const parsed = CreateComplaintBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const [complaint] = await db.insert(complaintsTable).values({
      ...parsed.data,
      status: "open",
      priority: parsed.data.priority ?? "medium",
    }).returning();
    res.status(201).json(complaint);
  } catch (err) {
    req.log.error({ err }, "Failed to create complaint");
    res.status(500).json({ error: "Failed to submit complaint" });
  }
});

router.patch("/complaints/:id", async (req, res) => {
  try {
    const paramsParsed = UpdateComplaintParams.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid ID" });

    const bodyParsed = UpdateComplaintBody.safeParse(req.body);
    if (!bodyParsed.success) return res.status(400).json({ error: "Invalid input" });

    const [updated] = await db.update(complaintsTable)
      .set(bodyParsed.data)
      .where(eq(complaintsTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Complaint not found" });
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update complaint");
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

export default router;
