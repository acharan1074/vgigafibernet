import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const connectionsTable = pgTable("connections", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  mobile: text("mobile").notNull(),
  whatsapp: text("whatsapp"),
  address: text("address").notNull(),
  village: text("village").notNull(),
  pinCode: text("pin_code").notNull(),
  planId: integer("plan_id"),
  connectionType: text("connection_type").notNull().default("home"),
  installationDate: text("installation_date"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertConnectionSchema = createInsertSchema(connectionsTable).omit({ id: true, createdAt: true, status: true });
export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Connection = typeof connectionsTable.$inferSelect;
