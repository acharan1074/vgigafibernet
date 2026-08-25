import app from "../artifacts/api-server/src/app";
import { connectDB } from "@workspace/db";

// Connect to MongoDB (reuses connection if already connected in serverless environments)
connectDB().catch(console.error);

export default app;
