import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

export const insertComplaintSchema = z.object({
  customerId: z.number().optional().nullable(),
  name: z.string(),
  mobile: z.string(),
  subject: z.string(),
  description: z.string(),
  status: z.string().default("open"),
  priority: z.string().default("medium"),
});
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;

export interface ComplaintDocument extends Document {
  customerId?: number;
  name: string;
  mobile: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema<ComplaintDocument>({
  customerId: { type: Number },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: "open" },
  priority: { type: String, default: "medium" },
}, { timestamps: true });

complaintSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export const Complaint = mongoose.models.Complaint || mongoose.model<ComplaintDocument>("Complaint", complaintSchema);
