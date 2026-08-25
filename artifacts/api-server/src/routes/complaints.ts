import { Router } from "express";
import { Complaint } from "@workspace/db";
import { CreateComplaintBody, UpdateComplaintBody, UpdateComplaintParams, ListComplaintsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/complaints", async (req, res) => {
  try {
    const parsed = ListComplaintsQueryParams.safeParse(req.query);
    const query = parsed.success && parsed.data.status ? { status: parsed.data.status } : {};
    const all = await Complaint.find(query).sort({ createdAt: 1 });
    res.json(all.map(c => c.toJSON()));
  } catch (err) {
    req.log.error({ err }, "Failed to list complaints");
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

router.post("/complaints", async (req, res) => {
  try {
    const parsed = CreateComplaintBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const complaint = await Complaint.create({
      ...parsed.data,
      status: "open",
      priority: parsed.data.priority ?? "medium",
    });
    res.status(201).json(complaint.toJSON());
  } catch (err) {
    req.log.error({ err }, "Failed to create complaint");
    res.status(500).json({ error: "Failed to submit complaint" });
  }
});

router.patch("/complaints/:id", async (req, res) => {
  try {
    const bodyParsed = UpdateComplaintBody.safeParse(req.body);
    if (!bodyParsed.success) return res.status(400).json({ error: "Invalid input" });

    const updated = await Complaint.findByIdAndUpdate(req.params.id, bodyParsed.data, { new: true });
    if (!updated) return res.status(404).json({ error: "Complaint not found" });
    res.json(updated.toJSON());
  } catch (err) {
    if ((err as any).name === "CastError") return res.status(400).json({ error: "Invalid ID" });
    req.log.error({ err }, "Failed to update complaint");
    res.status(500).json({ error: "Failed to update complaint" });
  }
});

export default router;
