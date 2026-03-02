"use client"

import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ShoppingCart, Loader2 } from "lucide-react";
import AuthButton from "./AuthBtn";
import AuthBtnMobile from "./AuthBtnMObile";
import useSessionStore from "../stores/sessionStore";
import useCartStore from "../stores/cartStore";

const Nav = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const { session, loading: sessionLoading } = useSessionStore();
  const userEmail = session?.data?.user?.email;

  // ✅ Use Zustand store instead of local state
  const { items: cart, setCart } = useCartStore();
  const [cartLoading, setCartLoading] = useState(false);

  /* ---------------- Fetch Cart ---------------- */
  useEffect(() => {
    if (sessionLoading) return; // wait until session is loaded

    if (!userEmail) {
      setCart([]);
      return;
    }

    const fetchCart = async () => {
      try {
        setCartLoading(true);
        const res = await fetch(`/api/cart/${userEmail}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data.cart)) {
          setCart(data.cart); // ✅ update store
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCart([]);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, [userEmail, sessionLoading, setCart]);

  /* ---------------- Hide on Scroll ---------------- */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
        setOpen(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 shadow-md transition-transform duration-300 ease-in-out bg-black ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Mobile - Cart */}
            <a href="/cart" className="md:hidden relative" aria-label="View Cart mobile">
              {cartLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6 cursor-pointer text-white" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </>
              )}
            </a>

            {/* Logo */}
            <div className="text-2xl flex gap-[100px] font-bold cursor-pointer text-white tracking-tight">
              <a href="/">SHEEN</a>

              <div className="hidden md:flex items-center space-x-8">
                <a href="/products/all" className="text-white font-medium text-sm tracking-wide relative group">
                  All Products
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </a>

                <a href="/products/women" className="text-white font-medium text-sm tracking-wide relative group">
                  Women
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </a>

                <a href="/products/men" className="text-white font-medium text-sm tracking-wide relative group">
                  Men
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </a>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/cart" className="relative" aria-label="View Cart">
                {cartLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                ) : (
                  <>
                    <ShoppingCart className="cursor-pointer text-white" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </>
                )}
              </a>

              <AuthButton />
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                className={`p-1 text-white transition-transform duration-300 ease-in-out ${
                  open ? "rotate-90" : "rotate-0"
                }`}
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-3 flex flex-col">
            <a href="/products/all" className="text-white font-medium text-base py-2.5 border-b border-gray-100">
              All Products
            </a>
            <a href="/products/women" className="text-white font-medium text-base py-2.5 border-b border-gray-100">
              Women
            </a>
            <a href="/products/men" className="text-white font-medium text-base py-2.5 border-b border-gray-100">
              Men
            </a>
          <AuthBtnMobile />
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div />
    </>
  );
};

export default Nav;