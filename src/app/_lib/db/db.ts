import mongoose from "mongoose";

const MONGO_DB_URI = process.env.MONGO_DB_URI!;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_DB_URI);
  console.log("✅ MongoDB connected");
}