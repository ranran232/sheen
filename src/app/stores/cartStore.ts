// src/stores/cartStore.ts
import { create } from "zustand";

export interface CartItem {
  _id: string;
  email: string;
  name: string;
  price: number;
  category: string;
  img: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (_id: string) => void;
  clearCart: () => void;
  setCart: (cart: CartItem[]) => void; // ✅ Add this
  total: () => number;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  // ✅ Set the entire cart
  setCart: (cart) => set({ items: cart }),

  addItem: (item) =>
    set((state) => {
      if (!state.items.find((i) => i._id === item._id)) {
        return { items: [...state.items, item] };
      }
      return state;
    }),

  removeItem: (_id) =>
    set((state) => ({ items: state.items.filter((item) => item._id !== _id) })),

  clearCart: () => set({ items: [] }),

  total: () => get().items.reduce((acc, item) => acc + item.price, 0),
}));

export default useCartStore;