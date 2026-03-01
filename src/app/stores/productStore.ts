import { create } from "zustand"

export interface ProductItem {
  name: string
  price: number
}

interface ProductState {
  items: ProductItem[]

  addItems: (item: ProductItem) => void
  removeItem: (index: number) => void
  clearItems: () => void
  getTotalPrice: () => number
}

const useProductStore = create<ProductState>((set, get) => ({
  items: [],

  addItems: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (index) =>
    set((state) => ({
      items: state.items.filter((_, i) => i !== index),
    })),

  clearItems: () =>
    set(() => ({
      items: [],
    })),

  getTotalPrice: () => {
    const { items } = get()
    return items.reduce((total, item) => total + item.price, 0)
  },
}))

export default useProductStore