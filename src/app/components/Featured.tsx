'use client'
import React, { useState, useEffect } from "react";

const FloatingProductCard = () => {
  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false); // animation start
  const [visible, setVisible] = useState(false); // mounted state

  const STORAGE_KEY = "floatingCardClosedAt";
  const DISPLAY_DELAY = 2000; // 2s delay before appear
  const REAPPEAR_HOURS = 8; // hours until it can show again after close

  useEffect(() => {
    const lastClosed = localStorage.getItem(STORAGE_KEY);
    const now = new Date().getTime();

    if (!lastClosed || now - parseInt(lastClosed, 10) >= REAPPEAR_HOURS * 60 * 60 * 1000) {
      // Never closed or enough time passed → show
      const timer = setTimeout(() => setShow(true), DISPLAY_DELAY);
      setVisible(true); // mount immediately

      return () => clearTimeout(timer);
    }
    // else do nothing → card stays hidden
  }, []);

  const handleClose = () => {
    setShow(false);
    // Save the time when user closed the card
    localStorage.setItem(STORAGE_KEY, new Date().getTime().toString());
    // Delay unmount to match exit animation
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible) return null;

  return (
    <div
      className={`
        absolute bottom-6 right-6 flex flex-row bg-white rounded-2xl overflow-hidden shadow-2xl w-80 cursor-pointer
        transform transition-all duration-500 ease-in-out
        ${hovered ? "-translate-y-1 shadow-[0_20px_50px_rgba(0,0,0,0.18)]" : "translate-y-0"}
        ${show ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative w-24 shrink-0 overflow-hidden bg-stone-200">
        <img
          src="/featured_product.webp"
          alt="Featured Product"
          className={`w-full h-full object-cover transition-transform duration-500 ease-in-out ${
            hovered ? "scale-110" : "scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 px-3.5 py-3 relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-700 rounded-full text-lg font-bold"
        >
          ×
        </button>

        <div>
          <span className="inline-block bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5">
            Featured
          </span>
          <p className="text-black font-bold text-sm leading-snug">
            The Essential Piece
          </p>
          <p className="text-stone-400 text-[11px] leading-snug mt-0.5">
            Crafted for everyday luxury
          </p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-black font-bold text-sm">999.00</span>
          <a
          href="/products/all"
            className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all duration-200 ${
              hovered ? "bg-black text-white" : "bg-stone-100 text-black"
            }`}
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default FloatingProductCard;