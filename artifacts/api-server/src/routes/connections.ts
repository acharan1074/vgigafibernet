import { Router } from "express";
import { Connection } from "@workspace/db";
import { CreateConnectionBody, UpdateConnectionBody, UpdateConnectionParams, ListConnectionsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/connections", async (req, res) => {
  try {
    const parsed = ListConnectionsQueryParams.safeParse(req.query);
    const query = parsed.success && parsed.data.status ? { status: parsed.data.status } : {};
    const rows = await Connection.find(query).sort({ createdAt: 1 });
    res.json(rows.map(r => r.toJSON()));
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
    const conn = await Connection.create({
      ...parsed.data,
      status: "pending",
    });
    res.status(201).json(conn.toJSON());
  } catch (err) {
    req.log.error({ err }, "Failed to create connection");
    res.status(500).json({ error: "Failed to create connection request" });
  }
});

router.patch("/connections/:id", async (req, res) => {
  try {
    const bodyParsed = UpdateConnectionBody.safeParse(req.body);
    if (!bodyParsed.success) return res.status(400).json({ error: "Invalid input" });

    const updated = await Connection.findByIdAndUpdate(req.params.id, bodyParsed.data, { new: true });
    if (!updated) return res.status(404).json({ error: "Connection not found" });
    res.json(updated.toJSON());
  } catch (err) {
    if ((err as any).name === "CastError") return res.status(400).json({ error: "Invalid ID" });
    req.log.error({ err }, "Failed to update connection");
    res.status(500).json({ error: "Failed to update connection" });
  }
});

export default router;
