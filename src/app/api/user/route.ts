import { NextRequest, NextResponse } from 'next/server';
import { Schema, model, models } from 'mongoose';
import { connectDB } from '@/app/_lib/db/db';

// 🔹 Define User schema & model
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const User = models.User || model('User', userSchema);

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, name } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    // 🔹 Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // User exists → welcome back
      return NextResponse.json({
        message: `Welcome back, ${existingUser.name}!`,
        user: existingUser,
      });
    }

    // 🔹 User doesn't exist → create new
    const newUser = await User.create({ email, name });

    return NextResponse.json({
      message: "Account created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Failed to save user:", error);
    return NextResponse.json(
      { error: "Failed to save user" },
      { status: 500 }
    );
  }
}