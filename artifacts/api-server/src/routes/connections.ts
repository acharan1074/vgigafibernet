import { Router } from "express";
import { db, connectionsTable } from "@workspace/db";
import { CreateConnectionBody, UpdateConnectionBody, UpdateConnectionParams, ListConnectionsQueryParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/connections", async (req, res) => {
  try {
    const parsed = ListConnectionsQueryParams.safeParse(req.query);
    let query = db.select().from(connectionsTable);
    const rows = await query.orderBy(connectionsTable.createdAt);
    const result = parsed.success && parsed.data.status
      ? rows.filter(r => r.status === parsed.data.status)
      : rows;
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to list connections");
    res.status(500).json({ error: "Failed to fetch connections" });
  }
});

router.post("/connections", async (req, res) => {
  try {
    const parsed = CreateConnectionBody.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    }
    const [conn] = await db.insert(connectionsTable).values({
      ...parsed.data,
      status: "pending",
    }).returning();
    res.status(201).json(conn);
  } catch (err) {
    req.log.error({ err }, "Failed to create connection");
    res.status(500).json({ error: "Failed to create connection request" });
  }
});

router.patch("/connections/:id", async (req, res) => {
  try {
    const paramsParsed = UpdateConnectionParams.safeParse(req.params);
    if (!paramsParsed.success) return res.status(400).json({ error: "Invalid ID" });

    const bodyParsed = UpdateConnectionBody.safeParse(req.body);
    if (!bodyParsed.success) return res.status(400).json({ error: "Invalid input" });

    const [updated] = await db.update(connectionsTable)
      .set(bodyParsed.data)
      .where(eq(connectionsTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Connection not found" });
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update connection");
    res.status(500).json({ error: "Failed to update connection" });
  }
});

export default router;
