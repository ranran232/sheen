import { NextRequest, NextResponse } from "next/server";
import { Schema, model, models } from "mongoose";
import { connectDB } from "@/app/_lib/db/db";

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    img: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", productSchema, "products");

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // ✅ If array → bulk insert
    if (Array.isArray(body)) {
      const insertedProducts = await Product.insertMany(body);

      return NextResponse.json(
        {
          message: "Products inserted successfully",
          count: insertedProducts.length,
          products: insertedProducts,
        },
        { status: 201 }
      );
    }

    // ✅ If single object
    const { name, price, category, img } = body;

    if (!name || !price || !category || !img) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      name,
      price,
      category,
      img,
    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    let products;

    // ✅ If category exists → filter
    if (category) {
      products = await Product.find({ category });
    } else {
      // ✅ If no category → return all
      products = await Product.find({});
    }

    return NextResponse.json(
      {
        count: products.length,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch products failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}