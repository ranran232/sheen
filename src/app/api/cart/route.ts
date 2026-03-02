import { NextRequest, NextResponse } from "next/server";
import { Schema, model, models } from "mongoose";
import { connectDB } from "@/app/_lib/db/db";

// ✅ Cart Schema
const cartSchema = new Schema(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

const Carts = models.Carts || model("Carts", cartSchema, "carts");

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, name, price, category, img } = await req.json();

    if (!email || !name || !price || !category || !img) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ✅ Check if item already exists for THIS user
    const existingItem = await Carts.findOne({ email, name });

    if (existingItem) {
      return NextResponse.json(
        { message: "Item already exists in your cart" }
      );
    }

    const newCartItem = await Carts.create({
      email,
      name,
      price,
      category,
      img,
    });

    return NextResponse.json(
      {
        message: "Item added to cart successfully",
        item: newCartItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add to cart failed:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}