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

// collection name: "carts"
const Carts = models.Carts || model("Carts", cartSchema, "carts");

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    await connectDB();

    // ✅ await the params since it's a Promise
    const { email } = await params;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const cartItems = await Carts.find({ email }).lean();

    return NextResponse.json(
      {
        success: true,
        count: cartItems.length,
        cart: cartItems,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET Cart Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}



export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  try {
    await connectDB();

    const { email } = await params;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Parse the request body to get the item ID (optional)
    const body = await req.json().catch(() => ({}));
    const { id } = body as { id?: string };

    let deleted;

    if (id) {
      // Delete a single cart item for this email
      deleted = await Carts.findOneAndDelete({ _id: id, email });
      if (!deleted) {
        return NextResponse.json(
          { success: false, message: "Item not found" },
          { status: 404 }
        );
      }
    } else {
      // Delete all cart items for this email
      deleted = await Carts.deleteMany({ email });
    }

    return NextResponse.json(
      {
        success: true,
        message: id
          ? "Item deleted successfully"
          : `Deleted ${deleted.deletedCount} items`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Cart Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete cart item(s)" },
      { status: 500 }
    );
  }
}