'use client'
import React, { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Checkout from '../components/Checkout'
import { Loader2 } from 'lucide-react' // spinner icon
import useProductStore from "../stores/productStore";
import { useRouter } from "next/navigation" 

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Page = () => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const {items, clearItems, getTotalPrice} = useProductStore();
  const router= useRouter();
  const totalPrice = getTotalPrice();
    // ✅ Redirect if no price
  useEffect(() => {
    if (items.length <= 0) {
      router.push("/")
    }
  }, [items, router])

  useEffect(() => {
    if (totalPrice <= 0) return

    const createPaymentIntent = async () => {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(totalPrice) })
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    }

    createPaymentIntent();
  }, [totalPrice]);

  if (!clientSecret) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
        <p className="text-lg font-medium text-gray-700">Preparing your payment...</p>
      </div>
    )
  }

  return (
    <div className='mt-[100px]'>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <Checkout price={totalPrice} />
      </Elements>
    </div>
  )
}

export default Page