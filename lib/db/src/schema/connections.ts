import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

export const insertConnectionSchema = z.object({
  fullName: z.string(),
  mobile: z.string(),
  whatsapp: z.string().optional().nullable(),
  address: z.string(),
  village: z.string(),
  pinCode: z.string(),
  planId: z.number().optional().nullable(),
  connectionType: z.string().default("home"),
  installationDate: z.string().optional().nullable(),
  status: z.string().default("pending"),
});
export type InsertConnection = z.infer<typeof insertConnectionSchema>;

export interface ConnectionDocument extends Document {
  fullName: string;
  mobile: string;
  whatsapp?: string;
  address: string;
  village: string;
  pinCode: string;
  planId?: number;
  connectionType: string;
  installationDate?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const connectionSchema = new Schema<ConnectionDocument>({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  whatsapp: { type: String },
  address: { type: String, required: true },
  village: { type: String, required: true },
  pinCode: { type: String, required: true },
  planId: { type: Number },
  connectionType: { type: String, default: "home" },
  installationDate: { type: String },
  status: { type: String, default: "pending" },
}, { timestamps: true });

connectionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export const Connection = mongoose.models.Connection || mongoose.model<ConnectionDocument>("Connection", connectionSchema);
