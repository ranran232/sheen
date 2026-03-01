'use client'

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import useCartStore from '../stores/cartStore'
import useProductStore from '../stores/productStore'
import useSessionStore from "../stores/sessionStore";

const CartPage: React.FC = () => {
  const router = useRouter()
  const { items, removeItem } = useCartStore()
  const { addItems, clearItems } = useProductStore()

  // assume the user's email is stored in localStorage or session
  const { session, loading: sessionLoading } = useSessionStore();
  const userEmail = session?.data?.user?.email;

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {}
      items.forEach(item => {
        initial[item._id] = true
      })
      return initial
    }
  )

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const totalAmount = useMemo(() => {
    return items
      .filter(item => checkedItems[item._id])
      .reduce((sum, item) => sum + item.price, 0)
  }, [items, checkedItems])

  const handleBuyNow = () => {
    const selectedItems = items.filter(item => checkedItems[item._id])
    if (selectedItems.length === 0) return

    clearItems()
    selectedItems.forEach(item => addItems({ name: item.name, price: item.price }))
    router.push('/payment')
  }

  const handleDelete = async (id: string) => {
    if (!userEmail) return;

    try {
      const res = await fetch(`/api/cart/${userEmail}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }), // send _id in body
      })

      const data = await res.json()

      if (res.ok) {
        removeItem(id) // update local store
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (!items.length) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Your cart is empty.
      </div>
    )
  }

  return (
   <>
    <div className="min-h-screen bg-gray-100 py-10 px-4 mt-[50px]">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        <div className="space-y-4">
          {items.map(item => (
            <div
              key={item._id}
              className="flex justify-between items-center border p-4 rounded-xl hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!checkedItems[item._id]}
                  onChange={() => toggleCheck(item._id)}
                  className="w-4 h-4 accent-blue-600"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">₱{item.price}</p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600 hover:text-red-800 font-medium transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 flex justify-between items-center">
          <p className="text-lg font-semibold">Total: ₱{totalAmount}</p>
          <button
            onClick={handleBuyNow}
            disabled={totalAmount === 0}
            className={`bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition disabled:bg-gray-400`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
   </>
    
  )
}

export default CartPage