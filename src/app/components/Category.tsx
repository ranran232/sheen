"use client";

import React, { useState } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import useSessionStore from "../stores/sessionStore";
import AuthButton from "./AuthBtn";
import useCartStore, { CartItem } from "../stores/cartStore";
import useProductStore from "../stores/productStore";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  img: string;
  category: string;
}

interface Props {
  products: Product[];
  category: string;
  loading?: boolean;
}

/* ---------------- Skeleton Card ---------------- */
const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-64 bg-gray-200" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />

        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-20" />

          <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-gray-200 rounded-xl" />
            <div className="h-9 w-9 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Main Component ---------------- */
const Category: React.FC<Props> = ({ products, category, loading }) => {
  const { session } = useSessionStore();
  const userEmail = session?.data?.user?.email;
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const {addItems} = useProductStore();

  // ✅ Zustand store
  const { addItem } = useCartStore();

  const handleAddToCart = async (product: Product) => {
    if (!userEmail) {
      setShowSignInModal(true);
      return;
    }

    try {
      setLoadingId(product._id);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          _id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          img: product.img,
        }),
      });

      if (res.ok) {
        // ✅ Add item to global cart store
        const newCartItem: CartItem = {
          _id: product._id,
          email: userEmail,
          name: product.name,
          price: product.price,
          category: product.category,
          img: product.img,
        };
        addItem(newCartItem);

        // Show success modal
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
      }

      await res.json();
    } catch (error) {
      console.error("Failed to add to cart", error);
    } finally {
      setLoadingId(null);
    }
  };

const handlePurchase = (name: string, price: number) => {
  addItems({ name, price })   // ✅ pass object
  router.push("/payment")
}



  return (
    <>
      <div className="w-full px-4 md:px-8 py-10">
        <h2 className="text-3xl font-semibold mb-8 text-center capitalize mt-[50px]">
          {category === "all" ? "All Products" : `${category} Products`}
        </h2>

        {/* ✅ Skeleton Loader */}
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group"
              >
                {/* Image */}
                <div className="w-full h-64 overflow-hidden cursor-pointer">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-3">
                  <h3 className="text-lg font-medium">{product.name}</h3>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-black">
                      ₱{product.price}
                    </span>

                    <div className="flex items-center gap-2">
                      <button onClick={()=> handlePurchase(product.name, product.price)} className="bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800 transition cursor-pointer">
                        Buy Now
                      </button>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={loadingId === product._id}
                        className="p-2 border rounded-xl hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {loadingId === product._id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <ShoppingCart size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl">
            <div className="bg-green-100 p-4 rounded-full">
              <Check className="text-green-600" size={28} />
            </div>
            <p className="text-lg font-medium">Item added to cart</p>
          </div>
        </div>
      )}

      {/* ❗ Sign in Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl">
            <p className="text-lg font-medium text-center">
              Please sign in first to add items to your cart
            </p>

            <div className="flex flex-col gap-2">
              <AuthButton />
              <button
                className="text-black px-4 py-2 text-sm cursor-pointer"
                onClick={() => setShowSignInModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Category;