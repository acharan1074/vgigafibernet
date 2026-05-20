import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  mobile: text("mobile").notNull().unique(),
  email: text("email"),
  address: text("address").notNull(),
  village: text("village").notNull(),
  pinCode: text("pin_code").notNull(),
  planId: integer("plan_id"),
  status: text("status").notNull().default("active"),
  dataUsedGB: real("data_used_gb").notNull().default(0),
  dataLimitGB: real("data_limit_gb").notNull().default(0),
  dueDate: text("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, createdAt: true });
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;
