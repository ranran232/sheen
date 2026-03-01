'use client'
import React, { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import useProductStore from "../stores/productStore"

interface CheckoutProps {
  price: number
  devMode?: boolean // toggle for dev "always success"
}

const Checkout: React.FC<CheckoutProps> = ({ price, devMode = false }) => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()

  const { items } = useProductStore()

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    if (!stripe || !elements) return

    setLoading(true)

    if (devMode) {
      // simulate network delay
      setTimeout(() => {
        setLoading(false)
        setSuccess(true)
      }, 1000)
      return
    }

    // real Stripe payment
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
         return_url: `${window.location.origin}/payment/success`,
      },
    })

    if (error) {
      setErrorMessage(error.message || 'Payment failed. Please try again.')
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  const handleBackToShopping = () => {
    setSuccess(false)
    router.push('/products/all') 
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Payment Successful!</h2>
        <p className="text-gray-700 mb-4">You have successfully paid ₱{price}.</p>
        <button
          onClick={handleBackToShopping}
          className="mt-2 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Checkout</h2>

      {/* Cart items list */}
      {items.length > 0 && (
        <div className="mb-4 border border-gray-200 rounded p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Your Items:</h3>
          <ul className="divide-y divide-gray-200">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between py-1">
                <span>{item.name}</span>
                <span>₱{item.price}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold mt-2 border-t border-gray-200 pt-2">
            <span>Total:</span>
            <span>₱{price}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <PaymentElement />
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
          `}
        >
          {loading ? 'Processing...' : `Pay ₱${price}`}
        </button>
      </form>
    </div>
  )
}

export default Checkout