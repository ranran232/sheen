'use client'

import Category from "@/app/components/Category";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  img: string;
  category: string;
}

interface ProductsResponse {
  products: Product[];
}

async function getProducts(slug?: string): Promise<Product[]> {
  const categorySlug = slug ?? "all";

  const endpoint =
    categorySlug === "all"
      ? '/api/products'
      : `/api/products?category=${categorySlug}`;

  const res = await fetch(endpoint, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: ProductsResponse = await res.json();

  return data.products.map((p) => ({
    ...p,
    category: p.category ?? categorySlug,
  }));
}

export default function Page() {
  const params = useParams<{ category?: string }>();
  const category = params?.category ?? "all";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getProducts(category)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));

  }, [category]);

  return (
   <>
    <Category
      products={products}
      category={category}
      loading={loading}
    />
    <Toaster position="bottom-right" richColors />
   </>
  );
}