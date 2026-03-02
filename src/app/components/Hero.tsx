import React from 'react'
import FloatingProductCard from './Featured'

const Hero = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
        style={{
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.2),
            rgba(0,0,0,0.4)
          ),
          url('/sheen_hero_bg.webp')
        `,
      }}
    >
      {/* Hero Content */}
      <div
        className="
          absolute inset-0 
          flex flex-col items-center justify-center text-center
          lg:items-start lg:justify-end lg:text-left
          px-6 lg:pb-20 lg:pl-16 top-[300px]
        "
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
          Find What Makes You Feel Amazing
        </h1>

        <p className="mt-4 max-w-md text-white text-base md:text-lg">
          From trending must-haves to everyday essentials, everything you need is just one click away.
        </p>

        <a href='/products/all' className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
          Start Shopping
        </a>
      </div>

      <FloatingProductCard />
    </div>
  )
}

export default Hero