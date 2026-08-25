import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

export const insertCustomerSchema = z.object({
  fullName: z.string(),
  mobile: z.string(),
  email: z.string().optional().nullable(),
  address: z.string(),
  village: z.string(),
  pinCode: z.string(),
  planId: z.number().optional().nullable(),
  status: z.string().default("active"),
  dataUsedGB: z.number().default(0),
  dataLimitGB: z.number().default(0),
  dueDate: z.string().optional().nullable(),
});
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export interface CustomerDocument extends Document {
  fullName: string;
  mobile: string;
  email?: string;
  address: string;
  village: string;
  pinCode: string;
  planId?: number;
  status: string;
  dataUsedGB: number;
  dataLimitGB: number;
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<CustomerDocument>({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  address: { type: String, required: true },
  village: { type: String, required: true },
  pinCode: { type: String, required: true },
  planId: { type: Number },
  status: { type: String, default: "active" },
  dataUsedGB: { type: Number, default: 0 },
  dataLimitGB: { type: Number, default: 0 },
  dueDate: { type: String },
}, { timestamps: true });

customerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export const Customer = mongoose.models.Customer || mongoose.model<CustomerDocument>("Customer", customerSchema);
