import { Router } from "express";
import { Customer } from "@workspace/db";
import { GetCustomerParams, ListCustomersQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/customers", async (req, res) => {
  try {
    const parsed = ListCustomersQueryParams.safeParse(req.query);
    let query: any = {};
    if (parsed.success && parsed.data.search) {
      const searchRegex = new RegExp(parsed.data.search, 'i');
      query = {
        $or: [
          { fullName: searchRegex },
          { mobile: searchRegex }
        ]
      };
    }
    const customers = await Customer.find(query).sort({ createdAt: 1 });
    res.json(customers.map(c => c.toJSON()));
  } catch (err) {
    req.log.error({ err }, "Failed to list customers");
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.get("/customers/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer.toJSON());
  } catch (err) {
    // If it's an invalid ObjectId, return 400
    if ((err as any).name === "CastError") return res.status(400).json({ error: "Invalid ID" });
    req.log.error({ err }, "Failed to get customer");
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

export default router;
