import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

export const insertPlanSchema = z.object({
  name: z.string(),
  category: z.string(),
  speed: z.number(),
  price: z.number(),
  features: z.array(z.string()).default([]),
  isPopular: z.boolean().default(false),
});
export type InsertPlan = z.infer<typeof insertPlanSchema>;

export interface PlanDocument extends Document {
  name: string;
  category: string;
  speed: number;
  price: number;
  features: string[];
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<PlanDocument>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  speed: { type: Number, required: true },
  price: { type: Number, required: true },
  features: { type: [String], default: [] },
  isPopular: { type: Boolean, default: false },
}, { timestamps: true });

planSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export const Plan = mongoose.models.Plan || mongoose.model<PlanDocument>("Plan", planSchema);
