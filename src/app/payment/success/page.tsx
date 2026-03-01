'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react' // nice SVG check icon
import useProductStore from '../../stores/productStore'

const SuccessPage = () => {
  const router = useRouter()
  const { clearItems } = useProductStore()

  // Clear cart just in case
  useEffect(() => {
    clearItems()
  }, [clearItems])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Animated Check */}
      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-green-100 mb-6">
        <CheckCircle className="text-green-600 w-20 h-20 animate-bounce" />
      </div>

      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Payment Successful
      </h1>

      <p className="text-gray-700 mb-6 text-center">
        Thank you! Your payment has been successfully processed.
      </p>

      <button
        onClick={() => router.push('/products/all')}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Back to Shopping
      </button>
    </div>
  )
}

export default SuccessPage