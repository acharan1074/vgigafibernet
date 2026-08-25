import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("DATABASE_URL must be defined");
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Export schemas and models
export * from "./schema/plans";
export * from "./schema/connections";
export * from "./schema/customers";
export * from "./schema/complaints";
