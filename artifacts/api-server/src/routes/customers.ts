import { Router } from "express";
import { db, customersTable } from "@workspace/db";
import { GetCustomerParams, ListCustomersQueryParams } from "@workspace/api-zod";
import { eq, ilike, or } from "drizzle-orm";

const router = Router();

router.get("/customers", async (req, res) => {
  try {
    const parsed = ListCustomersQueryParams.safeParse(req.query);
    let customers;
    if (parsed.success && parsed.data.search) {
      const s = `%${parsed.data.search}%`;
      customers = await db.select().from(customersTable)
        .where(or(ilike(customersTable.fullName, s), ilike(customersTable.mobile, s)));
    } else {
      customers = await db.select().from(customersTable).orderBy(customersTable.createdAt);
    }
    res.json(customers);
  } catch (err) {
    req.log.error({ err }, "Failed to list customers");
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.get("/customers/:id", async (req, res) => {
  try {
    const parsed = GetCustomerParams.safeParse(req.params);
    if (!parsed.success) return res.status(400).json({ error: "Invalid ID" });

    const customer = await db.select().from(customersTable)
      .where(eq(customersTable.id, parsed.data.id))
      .then(r => r[0]);

    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    req.log.error({ err }, "Failed to get customer");
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

export default router;
